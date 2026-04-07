import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";

module {
  // Key: conversationId (Text) → Map of userId → lastTyped timestamp
  public type TypingState = Map.Map<Text, Map.Map<CommonTypes.UserId, CommonTypes.Timestamp>>;

  public func newTypingState() : TypingState {
    Map.empty<Text, Map.Map<CommonTypes.UserId, CommonTypes.Timestamp>>();
  };

  // 5 seconds in nanoseconds
  let staleCutoffNs : Int = 5_000_000_000;

  public func setTypingStatus(
    typingState    : TypingState,
    conversationId : Text,
    userId         : CommonTypes.UserId,
    isTyping       : Bool,
  ) : () {
    let userMap = switch (typingState.get(conversationId)) {
      case null {
        let newMap = Map.empty<CommonTypes.UserId, CommonTypes.Timestamp>();
        typingState.add(conversationId, newMap);
        newMap
      };
      case (?m) m;
    };
    // Prune stale entries on each write
    let now = Time.now();
    let cutoff = now - staleCutoffNs;
    let stale = List.empty<CommonTypes.UserId>();
    for ((uid, ts) in userMap.entries()) {
      if (ts < cutoff) stale.add(uid);
    };
    stale.forEach(func(uid : CommonTypes.UserId) { userMap.remove(uid) });

    if (isTyping) {
      userMap.add(userId, now);
    } else {
      userMap.remove(userId);
    };
  };

  public func getTypingUsers(
    typingState    : TypingState,
    conversationId : Text,
    caller         : CommonTypes.UserId,
  ) : [CommonTypes.UserId] {
    let now = Time.now();
    let cutoff = now - staleCutoffNs;
    let userMap = switch (typingState.get(conversationId)) {
      case null return [];
      case (?m) m;
    };
    // Return active typers excluding caller (read-only, no mutation in query context)
    let result = List.empty<CommonTypes.UserId>();
    for ((uid, ts) in userMap.entries()) {
      if (ts >= cutoff and not Principal.equal(uid, caller)) result.add(uid);
    };
    result.toArray()
  };
};
