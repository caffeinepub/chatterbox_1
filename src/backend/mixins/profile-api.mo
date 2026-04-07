import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import CommonTypes "../types/common";
import ProfileTypes "../types/profile";
import ProfileLib "../lib/profile";

mixin (
  accessControlState : AccessControl.AccessControlState,
  profiles           : ProfileLib.State,
) {
  /// Get the caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?ProfileTypes.ProfilePublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ProfileLib.getProfile(profiles, caller);
  };

  /// Save/update the caller's profile
  public shared ({ caller }) func saveCallerUserProfile(req : ProfileTypes.SaveProfileRequest) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ProfileLib.saveProfile(profiles, caller, req);
  };

  /// Get any user's public profile by principal
  public query ({ caller }) func getUserProfile(userId : CommonTypes.UserId) : async ?ProfileTypes.ProfilePublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ProfileLib.getProfile(profiles, userId);
  };

  /// Look up a user by username (for adding contacts)
  public query ({ caller }) func findUserByUsername(username : Text) : async ?ProfileTypes.ProfilePublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ProfileLib.getProfileByUsername(profiles, username);
  };

  /// Heartbeat to mark caller as online and update lastSeen
  public shared ({ caller }) func heartbeat() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ProfileLib.heartbeat(profiles, caller);
  };

  /// Set presence status explicitly (online/away/offline)
  public shared ({ caller }) func setPresence(presence : CommonTypes.PresenceStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ProfileLib.updatePresence(profiles, caller, presence);
  };
};
