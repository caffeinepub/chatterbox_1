import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import CommonTypes "../types/common";
import GroupTypes "../types/groups";
import MessagingTypes "../types/messaging";

module {
  public type GroupsState      = Map.Map<CommonTypes.GroupId, GroupTypes.Group>;
  public type MembersState     = Map.Map<CommonTypes.GroupId, List.List<GroupTypes.GroupMember>>;
  public type GroupMsgsState   = Map.Map<CommonTypes.GroupId, List.List<MessagingTypes.Message>>;
  public type GroupCursors     = Map.Map<Text, CommonTypes.MessageId>; // key = "userId:groupId"

  public func newGroupsState() : GroupsState {
    Map.empty<CommonTypes.GroupId, GroupTypes.Group>();
  };

  public func newMembersState() : MembersState {
    Map.empty<CommonTypes.GroupId, List.List<GroupTypes.GroupMember>>();
  };

  public func newGroupMsgsState() : GroupMsgsState {
    Map.empty<CommonTypes.GroupId, List.List<MessagingTypes.Message>>();
  };

  public func newGroupCursors() : GroupCursors {
    Map.empty<Text, CommonTypes.MessageId>();
  };

  // Composite key for cursor map
  func cursorKey(userId : CommonTypes.UserId, groupId : CommonTypes.GroupId) : Text {
    userId.toText() # ":" # groupId.toText();
  };

  func memberHasUserId(userId : CommonTypes.UserId, m : GroupTypes.GroupMember) : Bool {
    Principal.equal(m.userId, userId)
  };

  func memberNotUserId(userId : CommonTypes.UserId, m : GroupTypes.GroupMember) : Bool {
    not Principal.equal(m.userId, userId)
  };

  func msgBeforeId(beforeId : CommonTypes.MessageId, m : MessagingTypes.Message) : Bool {
    m.id < beforeId
  };

  public func isMember(
    membersState : MembersState,
    groupId      : CommonTypes.GroupId,
    userId       : CommonTypes.UserId,
  ) : Bool {
    switch (membersState.get(groupId)) {
      case null false;
      case (?members) {
        switch (members.find(func(m : GroupTypes.GroupMember) : Bool { memberHasUserId(userId, m) })) {
          case null false;
          case (?_) true;
        };
      };
    };
  };

  public func createGroup(
    groupsState  : GroupsState,
    membersState : MembersState,
    nextId       : Nat,
    owner        : CommonTypes.UserId,
    req          : GroupTypes.CreateGroupRequest,
  ) : (CommonTypes.GroupId, Nat) {
    let groupId = nextId;
    let now = Time.now();
    let group : GroupTypes.Group = {
      id          = groupId;
      name        = req.name;
      description = req.description;
      icon        = req.icon;
      ownerId     = owner;
      createdAt   = now;
    };
    groupsState.add(groupId, group);

    // Creator becomes the owner member
    let ownerMember : GroupTypes.GroupMember = {
      groupId  = groupId;
      userId   = owner;
      joinedAt = now;
      role     = #owner;
    };
    let memberList = List.empty<GroupTypes.GroupMember>();
    memberList.add(ownerMember);
    membersState.add(groupId, memberList);

    (groupId, nextId + 1);
  };

  public func editGroup(
    groupsState : GroupsState,
    groupId     : CommonTypes.GroupId,
    caller      : CommonTypes.UserId,
    req         : GroupTypes.EditGroupRequest,
  ) : () {
    let group = switch (groupsState.get(groupId)) {
      case null Runtime.trap("Group not found");
      case (?g) g;
    };
    if (not Principal.equal(group.ownerId, caller)) Runtime.trap("Only owner can edit group");
    groupsState.add(groupId, { group with
      name        = req.name;
      description = req.description;
      icon        = req.icon;
    });
  };

  public func addMember(
    groupsState  : GroupsState,
    membersState : MembersState,
    groupId      : CommonTypes.GroupId,
    caller       : CommonTypes.UserId,
    newMember    : CommonTypes.UserId,
  ) : () {
    let group = switch (groupsState.get(groupId)) {
      case null Runtime.trap("Group not found");
      case (?g) g;
    };
    if (not Principal.equal(group.ownerId, caller)) Runtime.trap("Only owner can add members");
    if (isMember(membersState, groupId, newMember)) Runtime.trap("User is already a member");

    let members = switch (membersState.get(groupId)) {
      case null Runtime.trap("Members list not found");
      case (?m) m;
    };
    members.add({
      groupId  = groupId;
      userId   = newMember;
      joinedAt = Time.now();
      role     = #member;
    });
  };

  public func removeMember(
    groupsState  : GroupsState,
    membersState : MembersState,
    groupId      : CommonTypes.GroupId,
    caller       : CommonTypes.UserId,
    target       : CommonTypes.UserId,
  ) : () {
    let group = switch (groupsState.get(groupId)) {
      case null Runtime.trap("Group not found");
      case (?g) g;
    };
    if (not Principal.equal(group.ownerId, caller)) Runtime.trap("Only owner can remove members");
    if (Principal.equal(target, caller)) Runtime.trap("Owner cannot remove themselves; use leaveGroup");

    let members = switch (membersState.get(groupId)) {
      case null Runtime.trap("Members list not found");
      case (?m) m;
    };
    let filtered = members.filter(func(m : GroupTypes.GroupMember) : Bool { memberNotUserId(target, m) });
    members.clear();
    members.append(filtered);
  };

  public func leaveGroup(
    groupsState  : GroupsState,
    membersState : MembersState,
    groupId      : CommonTypes.GroupId,
    caller       : CommonTypes.UserId,
  ) : () {
    let group = switch (groupsState.get(groupId)) {
      case null Runtime.trap("Group not found");
      case (?g) g;
    };
    let members = switch (membersState.get(groupId)) {
      case null Runtime.trap("Members list not found");
      case (?m) m;
    };

    if (not isMember(membersState, groupId, caller)) Runtime.trap("Not a member");

    // Remove caller from list
    let remaining = members.filter(func(m : GroupTypes.GroupMember) : Bool { memberNotUserId(caller, m) });
    members.clear();
    members.append(remaining);

    // If the leaver was the owner, transfer ownership to the oldest remaining member
    if (Principal.equal(group.ownerId, caller)) {
      switch (members.first()) {
        case null {
          // No remaining members — group is now empty; keep it in state (can be cleaned up)
        };
        case (?oldestMember) {
          // Update group owner
          groupsState.add(groupId, { group with ownerId = oldestMember.userId });
          // Update that member's role to #owner
          members.mapInPlace(func(m : GroupTypes.GroupMember) : GroupTypes.GroupMember {
            if (Principal.equal(m.userId, oldestMember.userId)) { { m with role = #owner } }
            else m;
          });
        };
      };
    };
  };

  public func sendGroupMessage(
    groupsState  : GroupsState,
    membersState : MembersState,
    msgsState    : GroupMsgsState,
    nextMsgId    : Nat,
    groupId      : CommonTypes.GroupId,
    sender       : CommonTypes.UserId,
    req          : MessagingTypes.SendMessageRequest,
  ) : CommonTypes.MessageId {
    switch (groupsState.get(groupId)) {
      case null Runtime.trap("Group not found");
      case (?_) {};
    };
    if (not isMember(membersState, groupId, sender)) Runtime.trap("Not a member of this group");

    let kind : CommonTypes.MessageKind = switch (req.file) {
      case null #text;
      case (?_) #file;
    };
    let msg : MessagingTypes.Message = {
      id        = nextMsgId;
      senderId  = sender;
      content   = req.content;
      file      = req.file;
      kind      = kind;
      createdAt = Time.now();
    };

    let msgList = switch (msgsState.get(groupId)) {
      case null {
        let newList = List.empty<MessagingTypes.Message>();
        msgsState.add(groupId, newList);
        newList;
      };
      case (?l) l;
    };
    msgList.add(msg);
    nextMsgId;
  };

  public func getGroupMessages(
    msgsState : GroupMsgsState,
    groupId   : CommonTypes.GroupId,
    before    : ?CommonTypes.MessageId,
    limit     : Nat,
  ) : [MessagingTypes.Message] {
    let msgList = switch (msgsState.get(groupId)) {
      case null return [];
      case (?l) l;
    };
    let allMsgs = msgList.toArray();
    // Filter by before cursor if provided
    let filtered = switch (before) {
      case null allMsgs;
      case (?beforeId) allMsgs.filter(func(m : MessagingTypes.Message) : Bool { msgBeforeId(beforeId, m) });
    };
    // Return last `limit` messages (oldest to newest ordering)
    let total = filtered.size();
    if (total <= limit) {
      filtered;
    } else {
      let from : Int = (total - limit).toInt();
      let to   : Int = total.toInt();
      filtered.sliceToArray(from, to);
    };
  };

  public func markGroupRead(
    cursorsState : GroupCursors,
    userId       : CommonTypes.UserId,
    groupId      : CommonTypes.GroupId,
    upToMsgId    : CommonTypes.MessageId,
  ) : () {
    let key = cursorKey(userId, groupId);
    // Only advance the cursor, never move it backwards
    let current = switch (cursorsState.get(key)) {
      case null 0;
      case (?c) c;
    };
    if (upToMsgId > current) {
      cursorsState.add(key, upToMsgId);
    };
  };

  public func getGroupUnreadCount(
    msgsState    : GroupMsgsState,
    cursorsState : GroupCursors,
    userId       : CommonTypes.UserId,
    groupId      : CommonTypes.GroupId,
  ) : Nat {
    let lastRead = switch (cursorsState.get(cursorKey(userId, groupId))) {
      case null 0;
      case (?c) c;
    };
    let msgList = switch (msgsState.get(groupId)) {
      case null return 0;
      case (?l) l;
    };
    var unread : Nat = 0;
    msgList.forEach(func(m : MessagingTypes.Message) {
      if (m.id > lastRead) unread += 1;
    });
    unread;
  };

  public func getUserGroups(
    groupsState  : GroupsState,
    membersState : MembersState,
    msgsState    : GroupMsgsState,
    cursorsState : GroupCursors,
    userId       : CommonTypes.UserId,
  ) : [GroupTypes.GroupSummary] {
    // Collect all groupIds where user is a member
    let results = List.empty<GroupTypes.GroupSummary>();
    for ((groupId, memberList) in membersState.entries()) {
      let isMem = switch (memberList.find(func(m : GroupTypes.GroupMember) : Bool { memberHasUserId(userId, m) })) {
        case null false;
        case (?_) true;
      };
      if (isMem) {
        switch (groupsState.get(groupId)) {
          case null {};
          case (?group) {
            let memberCount = memberList.size();
            let unreadCount = getGroupUnreadCount(msgsState, cursorsState, userId, groupId);
            let lastMessage : ?CommonTypes.MessageId = switch (msgsState.get(groupId)) {
              case null null;
              case (?msgList) {
                switch (msgList.last()) {
                  case null null;
                  case (?m) ?m.id;
                };
              };
            };
            results.add({
              group       = group;
              memberCount = memberCount;
              lastMessage = lastMessage;
              unreadCount = unreadCount;
            });
          };
        };
      };
    };
    results.toArray();
  };

  // Returns userIds who have read up to or past the given messageId in a group.
  // key format: "userId:groupId"
  public func getGroupMessageReaders(
    cursorsState : GroupCursors,
    groupId      : CommonTypes.GroupId,
    messageId    : CommonTypes.MessageId,
  ) : [CommonTypes.UserId] {
    let suffix = ":" # groupId.toText();
    let result = List.empty<CommonTypes.UserId>();
    for ((key, cursor) in cursorsState.entries()) {
      if (cursor >= messageId and key.endsWith(#text suffix) and key.size() > suffix.size()) {
        let keyLen    : Int = key.size().toInt();
        let suffixLen : Int = suffix.size().toInt();
        let chars = key.toArray().sliceToArray(0, keyLen - suffixLen);
        let userIdText = Text.fromArray(chars);
        let userId = Principal.fromText(userIdText);
        result.add(userId);
      };
    };
    result.toArray()
  };
};
