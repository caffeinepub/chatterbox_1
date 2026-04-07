import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import ReactionTypes "../types/reactions";

module {
  // Composite key: conversationId # ":" # messageId
  public type ReactionKey = Text;
  // emoji → Set<UserId>
  public type EmojiMap = Map.Map<Text, Set.Set<CommonTypes.UserId>>;
  // reactionKey → EmojiMap
  public type ReactionsState = Map.Map<ReactionKey, EmojiMap>;

  public func newReactionsState() : ReactionsState {
    Map.empty<ReactionKey, EmojiMap>();
  };

  func reactionKey(conversationId : Text, messageId : Nat) : ReactionKey {
    conversationId # ":" # debug_show(messageId)
  };

  public func addReaction(
    reactionsState : ReactionsState,
    conversationId : Text,
    messageId      : Nat,
    emoji          : Text,
    caller         : CommonTypes.UserId,
  ) : () {
    let key = reactionKey(conversationId, messageId);
    let emojiMap = switch (reactionsState.get(key)) {
      case null {
        let newMap = Map.empty<Text, Set.Set<CommonTypes.UserId>>();
        reactionsState.add(key, newMap);
        newMap
      };
      case (?m) m;
    };
    let userSet = switch (emojiMap.get(emoji)) {
      case null {
        let newSet = Set.empty<CommonTypes.UserId>();
        emojiMap.add(emoji, newSet);
        newSet
      };
      case (?s) s;
    };
    userSet.add(caller);
  };

  public func removeReaction(
    reactionsState : ReactionsState,
    conversationId : Text,
    messageId      : Nat,
    emoji          : Text,
    caller         : CommonTypes.UserId,
  ) : () {
    let key = reactionKey(conversationId, messageId);
    switch (reactionsState.get(key)) {
      case null {};
      case (?emojiMap) {
        switch (emojiMap.get(emoji)) {
          case null {};
          case (?userSet) {
            userSet.remove(caller);
            // Clean up empty set
            if (userSet.isEmpty()) {
              emojiMap.remove(emoji);
            };
          };
        };
      };
    };
  };

  public func getReactions(
    reactionsState : ReactionsState,
    conversationId : Text,
    messageId      : Nat,
  ) : [ReactionTypes.ReactionEntry] {
    let key = reactionKey(conversationId, messageId);
    switch (reactionsState.get(key)) {
      case null [];
      case (?emojiMap) {
        let result = List.empty<ReactionTypes.ReactionEntry>();
        for ((emoji, userSet) in emojiMap.entries()) {
          if (not userSet.isEmpty()) {
            result.add({
              emoji = emoji;
              users = userSet.toArray();
            });
          };
        };
        result.toArray()
      };
    };
  };
};
