import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import CommonTypes "../types/common";
import ProfileTypes "../types/profile";

module {
  public type State = Map.Map<CommonTypes.UserId, ProfileTypes.Profile>;

  public func newState() : State {
    Map.empty<CommonTypes.UserId, ProfileTypes.Profile>();
  };

  public func getProfile(state : State, userId : CommonTypes.UserId) : ?ProfileTypes.ProfilePublic {
    switch (state.get(userId)) {
      case (?profile) { ?toPublic(profile) };
      case null { null };
    };
  };

  public func getProfileByUsername(state : State, username : Text) : ?ProfileTypes.ProfilePublic {
    let lower = username.toLower();
    switch (state.values().find(func(p : ProfileTypes.Profile) : Bool { p.username.toLower() == lower })) {
      case (?profile) { ?toPublic(profile) };
      case null { null };
    };
  };

  public func saveProfile(state : State, caller : CommonTypes.UserId, req : ProfileTypes.SaveProfileRequest) : () {
    // Enforce username uniqueness — exclude caller's own existing entry
    if (not isUsernameAvailable(state, req.username, ?caller)) {
      Runtime.trap("Username already taken");
    };
    let now = Time.now();
    let profile : ProfileTypes.Profile = {
      userId   = caller;
      username = req.username;
      avatar   = req.avatar;
      status   = req.status;
      presence = #online;
      lastSeen = now;
    };
    state.add(caller, profile);
  };

  public func updatePresence(state : State, caller : CommonTypes.UserId, presence : CommonTypes.PresenceStatus) : () {
    switch (state.get(caller)) {
      case (?existing) {
        let now = Time.now();
        state.add(caller, { existing with presence; lastSeen = now });
      };
      case null {
        Runtime.trap("Profile not found");
      };
    };
  };

  public func heartbeat(state : State, caller : CommonTypes.UserId) : () {
    switch (state.get(caller)) {
      case (?existing) {
        let now = Time.now();
        state.add(caller, { existing with presence = #online; lastSeen = now });
      };
      case null {
        Runtime.trap("Profile not found");
      };
    };
  };

  // Returns true if username is unique (not taken by another user)
  public func isUsernameAvailable(state : State, username : Text, excludeUserId : ?CommonTypes.UserId) : Bool {
    let lower = username.toLower();
    let conflict = state.entries().find(func((uid, p) : (CommonTypes.UserId, ProfileTypes.Profile)) : Bool {
      if (p.username.toLower() != lower) { return false };
      switch (excludeUserId) {
        case (?excluded) { not Principal.equal(uid, excluded) };
        case null { true };
      };
    });
    switch (conflict) {
      case (?_) { false };
      case null { true };
    };
  };

  public func toPublic(profile : ProfileTypes.Profile) : ProfileTypes.ProfilePublic {
    {
      userId   = profile.userId;
      username = profile.username;
      avatar   = profile.avatar;
      status   = profile.status;
      presence = profile.presence;
      lastSeen = profile.lastSeen;
    };
  };
};
