import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import ContactTypes "../types/contacts";
import ContactLib "../lib/contacts";
import ProfileLib "../lib/profile";

mixin (
  accessControlState : AccessControl.AccessControlState,
  profiles           : ProfileLib.State,
  contactRequests    : ContactLib.RequestsState,
  contacts           : ContactLib.ContactsState,
) {
  var nextContactReqId : Nat = 0;

  /// Send a contact request to target principal
  public shared ({ caller }) func sendContactRequest(target : CommonTypes.UserId) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    if (Principal.equal(caller, target)) {
      Runtime.trap("Cannot send contact request to yourself");
    };
    let id = nextContactReqId;
    nextContactReqId += 1;
    ContactLib.sendContactRequest(contactRequests, id, caller, target);
  };

  /// Accept a pending contact request
  public shared ({ caller }) func acceptContactRequest(requestId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ContactLib.acceptContactRequest(contactRequests, contacts, requestId, caller);
  };

  /// Reject or cancel a contact request
  public shared ({ caller }) func rejectContactRequest(requestId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ContactLib.rejectContactRequest(contactRequests, requestId, caller);
  };

  /// Remove an accepted contact
  public shared ({ caller }) func removeContact(target : CommonTypes.UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ContactLib.removeContact(contacts, caller, target);
  };

  /// List all accepted contacts for the caller
  public query ({ caller }) func getContacts() : async [ContactTypes.Contact] {
    ContactLib.getContacts(contacts, profiles, caller);
  };

  /// List incoming pending contact requests for the caller
  public query ({ caller }) func getPendingContactRequests() : async [ContactTypes.ContactRequest] {
    ContactLib.getPendingRequests(contactRequests, caller);
  };

  /// List outgoing contact requests sent by the caller
  public query ({ caller }) func getSentContactRequests() : async [ContactTypes.ContactRequest] {
    ContactLib.getSentRequests(contactRequests, caller);
  };
};
