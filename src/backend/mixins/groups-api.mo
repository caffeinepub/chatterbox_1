import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import CommonTypes "../types/common";
import GroupTypes "../types/groups";
import MessagingTypes "../types/messaging";
import GroupLib "../lib/groups";

mixin (
  accessControlState : AccessControl.AccessControlState,
  groups             : GroupLib.GroupsState,
  groupMembers       : GroupLib.MembersState,
  groupMessages      : GroupLib.GroupMsgsState,
  groupReadCursors   : GroupLib.GroupCursors,
) {
  var nextGroupId    : Nat = 0;
  var nextGroupMsgId : Nat = 0;

  /// Create a new group chat
  public shared ({ caller }) func createGroup(req : GroupTypes.CreateGroupRequest) : async CommonTypes.GroupId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let (groupId, newNextId) = GroupLib.createGroup(
      groups, groupMembers, nextGroupId, caller, req,
    );
    nextGroupId := newNextId;
    groupId;
  };

  /// Edit group details (owner only)
  public shared ({ caller }) func editGroup(
    groupId : CommonTypes.GroupId,
    req     : GroupTypes.EditGroupRequest,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    GroupLib.editGroup(groups, groupId, caller, req);
  };

  /// Invite/add a member to a group (owner only)
  public shared ({ caller }) func addGroupMember(
    groupId   : CommonTypes.GroupId,
    newMember : CommonTypes.UserId,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    GroupLib.addMember(groups, groupMembers, groupId, caller, newMember);
  };

  /// Remove a member from a group (owner only)
  public shared ({ caller }) func removeGroupMember(
    groupId : CommonTypes.GroupId,
    target  : CommonTypes.UserId,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    GroupLib.removeMember(groups, groupMembers, groupId, caller, target);
  };

  /// Leave a group (any member)
  public shared ({ caller }) func leaveGroup(groupId : CommonTypes.GroupId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    GroupLib.leaveGroup(groups, groupMembers, groupId, caller);
  };

  /// Send a message to a group
  public shared ({ caller }) func sendGroupMessage(
    groupId : CommonTypes.GroupId,
    req     : MessagingTypes.SendMessageRequest,
  ) : async CommonTypes.MessageId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let msgId = GroupLib.sendGroupMessage(
      groups, groupMembers, groupMessages,
      nextGroupMsgId, groupId, caller, req,
    );
    nextGroupMsgId := nextGroupMsgId + 1;
    msgId;
  };

  /// Retrieve messages from a group (paginated, oldest to newest)
  public query ({ caller }) func getGroupMessages(
    groupId : CommonTypes.GroupId,
    before  : ?CommonTypes.MessageId,
    limit   : Nat,
  ) : async [MessagingTypes.Message] {
    GroupLib.getGroupMessages(groupMessages, groupId, before, limit);
  };

  /// Mark group messages as read up to a messageId
  public shared ({ caller }) func markGroupRead(
    groupId   : CommonTypes.GroupId,
    upToMsgId : CommonTypes.MessageId,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    GroupLib.markGroupRead(groupReadCursors, caller, groupId, upToMsgId);
  };

  /// Get all groups the caller is a member of (for polling inbox)
  public query ({ caller }) func getUserGroups() : async [GroupTypes.GroupSummary] {
    GroupLib.getUserGroups(groups, groupMembers, groupMessages, groupReadCursors, caller);
  };

  /// Get group details
  public query ({ caller }) func getGroup(groupId : CommonTypes.GroupId) : async ?GroupTypes.Group {
    groups.get(groupId);
  };

  /// Get group member list
  public query ({ caller }) func getGroupMembers(groupId : CommonTypes.GroupId) : async [GroupTypes.GroupMember] {
    switch (groupMembers.get(groupId)) {
      case null [];
      case (?members) members.toArray();
    };
  };

  /// Get users who have read up to or past the given messageId in a group
  public query ({ caller }) func getGroupMessageReaders(
    groupId   : CommonTypes.GroupId,
    messageId : CommonTypes.MessageId,
  ) : async [CommonTypes.UserId] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    GroupLib.getGroupMessageReaders(groupReadCursors, groupId, messageId)
  };
};
