import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import CommonTypes "../types/common";
import ReactionTypes "../types/reactions";
import ReactionLib "../lib/reactions";

mixin (
  accessControlState : AccessControl.AccessControlState,
  reactionsState     : ReactionLib.ReactionsState,
) {
  /// Add caller's reaction (emoji) to a message
  public shared ({ caller }) func addReaction(
    conversationId : Text,
    messageId      : Nat,
    emoji          : Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ReactionLib.addReaction(reactionsState, conversationId, messageId, emoji, caller)
  };

  /// Remove caller's reaction (emoji) from a message
  public shared ({ caller }) func removeReaction(
    conversationId : Text,
    messageId      : Nat,
    emoji          : Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ReactionLib.removeReaction(reactionsState, conversationId, messageId, emoji, caller)
  };

  /// Get all reactions for a message
  public query ({ caller }) func getReactions(
    conversationId : Text,
    messageId      : Nat,
  ) : async [ReactionTypes.ReactionEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ReactionLib.getReactions(reactionsState, conversationId, messageId)
  };
};
