import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import CommonTypes "../types/common";
import MessagingTypes "../types/messaging";
import MessagingLib "../lib/messaging";

mixin (
  accessControlState : AccessControl.AccessControlState,
  conversations      : MessagingLib.ConversationsState,
  directMessages     : MessagingLib.MessagesState,
  readCursors        : MessagingLib.ReadCursorsState,
  counters           : MessagingLib.Counters,
) {
  /// Get or create a direct conversation with another user; returns conversationId
  public shared ({ caller }) func getOrCreateDirectConversation(other : CommonTypes.UserId) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    MessagingLib.getOrCreateConversation(conversations, counters, caller, other)
  };

  /// Send a message in a direct conversation
  public shared ({ caller }) func sendDirectMessage(
    conversationId : Nat,
    req            : MessagingTypes.SendMessageRequest,
  ) : async CommonTypes.MessageId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    // Verify caller is a participant
    switch (conversations.get(conversationId)) {
      case null { Runtime.trap("Conversation not found") };
      case (?conv) {
        let (p1, p2) = conv.participants;
        if (not (caller == p1 or caller == p2)) {
          Runtime.trap("Not a participant of this conversation");
        };
      };
    };
    MessagingLib.sendDirectMessage(directMessages, conversations, counters, conversationId, caller, req)
  };

  /// Retrieve messages from a direct conversation (paginated, oldest to newest)
  public query ({ caller }) func getDirectMessages(
    conversationId : Nat,
    before         : ?CommonTypes.MessageId,
    limit          : Nat,
  ) : async [MessagingTypes.Message] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    // Verify caller is a participant
    switch (conversations.get(conversationId)) {
      case null { Runtime.trap("Conversation not found") };
      case (?conv) {
        let (p1, p2) = conv.participants;
        if (not (caller == p1 or caller == p2)) {
          Runtime.trap("Not a participant of this conversation");
        };
      };
    };
    let effectiveLimit = if (limit == 0 or limit > 100) 50 else limit;
    MessagingLib.getDirectMessages(directMessages, conversationId, before, effectiveLimit)
  };

  /// Mark messages as read up to a given message ID
  public shared ({ caller }) func markDirectRead(
    conversationId : Nat,
    upToMessageId  : CommonTypes.MessageId,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    MessagingLib.markDirectRead(readCursors, caller, conversationId, upToMessageId)
  };

  /// Get unread message count for caller in a conversation
  public query ({ caller }) func getUnreadDirectCount(conversationId : Nat) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    MessagingLib.getUnreadDirectCount(directMessages, readCursors, caller, conversationId)
  };

  /// Get all direct conversation summaries for the caller (for polling inbox)
  public query ({ caller }) func getDirectConversationSummaries() : async [MessagingTypes.DirectConversationSummary] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    MessagingLib.getDirectConversationSummaries(conversations, directMessages, readCursors, caller)
  };

  /// Get users who have read up to or past the given messageId in a direct conversation
  public query ({ caller }) func getDirectMessageReaders(
    conversationId : Nat,
    messageId      : CommonTypes.MessageId,
  ) : async [CommonTypes.UserId] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    MessagingLib.getDirectMessageReaders(readCursors, conversationId, messageId)
  };
};
