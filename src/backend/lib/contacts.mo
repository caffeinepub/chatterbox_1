import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import CommonTypes "../types/common";
import ContactTypes "../types/contacts";
import ProfileTypes "../types/profile";

module {
  public type RequestsState = Map.Map<Nat, ContactTypes.ContactRequest>;
  public type ContactsState = Map.Map<CommonTypes.UserId, List.List<CommonTypes.UserId>>;

  public func newRequestsState() : RequestsState {
    Map.empty<Nat, ContactTypes.ContactRequest>();
  };

  public func newContactsState() : ContactsState {
    Map.empty<CommonTypes.UserId, List.List<CommonTypes.UserId>>();
  };

  /// Creates a new contact request. Returns the new request ID.
  /// Traps if a pending request already exists between from and to.
  public func sendContactRequest(
    requestsState : RequestsState,
    nextId        : Nat,
    from          : CommonTypes.UserId,
    to            : CommonTypes.UserId,
  ) : Nat {
    // Prevent duplicate pending requests in either direction
    let existing = requestsState.entries().find(func((_, req) : (Nat, ContactTypes.ContactRequest)) : Bool {
      req.status == #pending and (
        (Principal.equal(req.from, from) and Principal.equal(req.to, to)) or
        (Principal.equal(req.from, to) and Principal.equal(req.to, from))
      )
    });
    switch (existing) {
      case (?(_, _)) { Runtime.trap("Contact request already pending") };
      case null {};
    };

    let request : ContactTypes.ContactRequest = {
      id        = nextId;
      from      = from;
      to        = to;
      createdAt = Time.now();
      status    = #pending;
    };
    requestsState.add(nextId, request);
    nextId;
  };

  /// Accepts a pending request addressed to `caller`. Both users become contacts.
  public func acceptContactRequest(
    requestsState : RequestsState,
    contactsState : ContactsState,
    requestId     : Nat,
    caller        : CommonTypes.UserId,
  ) : () {
    let req = switch (requestsState.get(requestId)) {
      case (?r) r;
      case null { Runtime.trap("Request not found") };
    };
    if (not Principal.equal(req.to, caller)) {
      Runtime.trap("Not authorized to accept this request");
    };
    if (req.status != #pending) {
      Runtime.trap("Request is not pending");
    };

    // Update request status to accepted
    let updated : ContactTypes.ContactRequest = { req with status = #accepted };
    requestsState.add(requestId, updated);

    // Add bidirectional contact entries
    _addContact(contactsState, req.from, req.to);
    _addContact(contactsState, req.to, req.from);
  };

  /// Rejects or cancels a pending request. Only the recipient (to) may reject.
  public func rejectContactRequest(
    requestsState : RequestsState,
    requestId     : Nat,
    caller        : CommonTypes.UserId,
  ) : () {
    let req = switch (requestsState.get(requestId)) {
      case (?r) r;
      case null { Runtime.trap("Request not found") };
    };
    if (not Principal.equal(req.to, caller) and not Principal.equal(req.from, caller)) {
      Runtime.trap("Not authorized to reject this request");
    };
    if (req.status != #pending) {
      Runtime.trap("Request is not pending");
    };
    requestsState.remove(requestId);
  };

  /// Removes contact from both users' contact lists.
  public func removeContact(
    contactsState : ContactsState,
    caller        : CommonTypes.UserId,
    target        : CommonTypes.UserId,
  ) : () {
    _removeContact(contactsState, caller, target);
    _removeContact(contactsState, target, caller);
  };

  /// Returns Contact records for all accepted contacts of `userId`.
  public func getContacts(
    contactsState : ContactsState,
    profilesState : Map.Map<CommonTypes.UserId, ProfileTypes.Profile>,
    userId        : CommonTypes.UserId,
  ) : [ContactTypes.Contact] {
    let contactIds = switch (contactsState.get(userId)) {
      case (?list) list;
      case null { return [] };
    };

    // Build Contact records, skipping any whose profile is missing
    let result = List.empty<ContactTypes.Contact>();
    contactIds.forEach(func(contactId : CommonTypes.UserId) {
      switch (profilesState.get(contactId)) {
        case (?profile) {
          result.add({
            userId   = contactId;
            username = profile.username;
            addedAt  = profile.lastSeen; // best available timestamp; exact addedAt not stored separately
          });
        };
        case null {};
      };
    });
    result.toArray();
  };

  /// Returns incoming pending contact requests for `userId`.
  public func getPendingRequests(
    requestsState : RequestsState,
    userId        : CommonTypes.UserId,
  ) : [ContactTypes.ContactRequest] {
    requestsState.values().filter(func(req : ContactTypes.ContactRequest) : Bool {
      Principal.equal(req.to, userId) and req.status == #pending
    }).toArray();
  };

  /// Returns outgoing contact requests sent by `userId`.
  public func getSentRequests(
    requestsState : RequestsState,
    userId        : CommonTypes.UserId,
  ) : [ContactTypes.ContactRequest] {
    requestsState.values().filter(func(req : ContactTypes.ContactRequest) : Bool {
      Principal.equal(req.from, userId)
    }).toArray();
  };

  /// Returns true if user `a` and user `b` are in each other's contact lists.
  public func areContacts(
    contactsState : ContactsState,
    a             : CommonTypes.UserId,
    b             : CommonTypes.UserId,
  ) : Bool {
    switch (contactsState.get(a)) {
      case (?list) { list.find(func(id : CommonTypes.UserId) : Bool { Principal.equal(id, b) }) != null };
      case null false;
    };
  };

  // ── Private helpers ──────────────────────────────────────────────────────

  func _addContact(state : ContactsState, owner : CommonTypes.UserId, contact : CommonTypes.UserId) {
    switch (state.get(owner)) {
      case (?list) {
        // Avoid duplicate entries
        if (list.find(func(id : CommonTypes.UserId) : Bool { Principal.equal(id, contact) }) == null) {
          list.add(contact);
        };
      };
      case null {
        let newList = List.empty<CommonTypes.UserId>();
        newList.add(contact);
        state.add(owner, newList);
      };
    };
  };

  func _removeContact(state : ContactsState, owner : CommonTypes.UserId, contact : CommonTypes.UserId) {
    switch (state.get(owner)) {
      case (?list) {
        let filtered = list.filter(func(id : CommonTypes.UserId) : Bool {
          not Principal.equal(id, contact)
        });
        state.add(owner, filtered);
      };
      case null {};
    };
  };
};
