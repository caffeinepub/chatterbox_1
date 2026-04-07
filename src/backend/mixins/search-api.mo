import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import MessagingTypes "../types/messaging";
import SearchTypes "../types/search";
import MessagingLib "../lib/messaging";
import GroupLib "../lib/groups";

mixin (
  accessControlState : AccessControl.AccessControlState,
  conversations      : MessagingLib.ConversationsState,
  directMessages     : MessagingLib.MessagesState,
  groups             : GroupLib.GroupsState,
  groupMembers       : GroupLib.MembersState,
  groupMessages      : GroupLib.GroupMsgsState,
) {
  /// Search messages across all direct and group conversations the caller has access to.
  /// Case-insensitive substring match; returns up to 20 results ordered by createdAt descending.
  public query ({ caller }) func searchMessages(searchTerm : Text) : async [SearchTypes.SearchResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    if (searchTerm.size() == 0) return [];

    let lowerQuery = searchTerm.toLower();
    let results = List.empty<SearchTypes.SearchResult>();

    // Search direct messages
    for ((convId, conv) in conversations.entries()) {
      let (p1, p2) = conv.participants;
      let isParticipant = Principal.equal(p1, caller) or Principal.equal(p2, caller);
      if (isParticipant) {
        switch (directMessages.get(convId)) {
          case null {};
          case (?msgList) {
            let convIdText = debug_show(convId);
            msgList.forEach(func(m : MessagingTypes.Message) {
              if (m.content.toLower().contains(#text lowerQuery)) {
                results.add({
                  messageId        = m.id;
                  conversationId   = convIdText;
                  conversationType = #direct;
                  senderId         = m.senderId;
                  content          = m.content;
                  createdAt        = m.createdAt;
                });
              };
            });
          };
        };
      };
    };

    // Search group messages
    for ((groupId, _) in groups.entries()) {
      if (GroupLib.isMember(groupMembers, groupId, caller)) {
        switch (groupMessages.get(groupId)) {
          case null {};
          case (?msgList) {
            let convIdText = "group:" # groupId.toText();
            msgList.forEach(func(m : MessagingTypes.Message) {
              if (m.content.toLower().contains(#text lowerQuery)) {
                results.add({
                  messageId        = m.id;
                  conversationId   = convIdText;
                  conversationType = #group;
                  senderId         = m.senderId;
                  content          = m.content;
                  createdAt        = m.createdAt;
                });
              };
            });
          };
        };
      };
    };

    // Sort by createdAt descending and return up to 20 results
    let sorted = results.sort(func(a : SearchTypes.SearchResult, b : SearchTypes.SearchResult) : { #less; #equal; #greater } {
      if (a.createdAt > b.createdAt) #less
      else if (a.createdAt < b.createdAt) #greater
      else #equal
    });
    let arr = sorted.toArray();
    if (arr.size() <= 20) arr else arr.sliceToArray(0, 20)
  };
};
