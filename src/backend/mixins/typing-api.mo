import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import CommonTypes "../types/common";
import TypingLib "../lib/typing";

mixin (
  accessControlState : AccessControl.AccessControlState,
  typingState        : TypingLib.TypingState,
) {
  /// Set or clear typing status for the caller in a conversation.
  /// conversationId: "p1:p2" for direct (sorted principals) or "group:<id>" for groups.
  public shared ({ caller }) func setTypingStatus(
    conversationId : Text,
    isTyping       : Bool,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    TypingLib.setTypingStatus(typingState, conversationId, caller, isTyping)
  };

  /// Get users currently typing in a conversation (excludes caller, filters stale >5s entries).
  public query ({ caller }) func getTypingUsers(conversationId : Text) : async [CommonTypes.UserId] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    TypingLib.getTypingUsers(typingState, conversationId, caller)
  };
};
