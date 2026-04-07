import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import CallTypes "../types/calls";

module {
  // In-memory only — no persistence needed for calls
  public type CallsState = Map.Map<CallTypes.CallId, CallTypes.CallState>;

  public type Counters = {
    var nextCallId : Nat;
  };

  public func newCallsState() : CallsState {
    Map.empty<CallTypes.CallId, CallTypes.CallState>();
  };

  public func newCounters() : Counters {
    { var nextCallId = 0 };
  };

  // Convert mutable CallState to shared CallStatePublic
  public func toPublic(cs : CallTypes.CallState) : CallTypes.CallStatePublic {
    {
      id               = cs.id;
      callerId         = cs.callerId;
      calleeId         = cs.calleeId;
      status           = cs.status;
      sdpOffer         = cs.sdpOffer;
      sdpAnswer        = cs.sdpAnswer;
      callerCandidates = cs.callerCandidates;
      calleeCandidates = cs.calleeCandidates;
      createdAt        = cs.createdAt;
      updatedAt        = cs.updatedAt;
      isVideo          = cs.isVideo;
    }
  };

  // Garbage collect ended/declined calls older than 10 minutes
  func garbageCollect(callsState : CallsState) {
    let tenMinutesNs : Int = 10 * 60 * 1_000_000_000;
    let cutoff = Time.now() - tenMinutesNs;
    let toRemove = List.empty<CallTypes.CallId>();
    for ((callId, cs) in callsState.entries()) {
      let isTerminated = switch (cs.status) {
        case (#ended or #declined) true;
        case _ false;
      };
      if (isTerminated and cs.updatedAt < cutoff) {
        toRemove.add(callId);
      };
    };
    toRemove.forEach(func(callId : CallTypes.CallId) {
      callsState.remove(callId);
    });
  };

  public func createCall(
    callsState : CallsState,
    counters   : Counters,
    caller     : CommonTypes.UserId,
    calleeId   : CommonTypes.UserId,
    sdpOffer   : Text,
    isVideo    : Bool,
  ) : CallTypes.CallId {
    garbageCollect(callsState);
    let now = Time.now();
    let callId = counters.nextCallId;
    counters.nextCallId += 1;
    let cs : CallTypes.CallState = {
      id                   = callId;
      callerId             = caller;
      calleeId             = calleeId;
      var status           = #ringing;
      var sdpOffer         = ?sdpOffer;
      var sdpAnswer        = null;
      var callerCandidates = [];
      var calleeCandidates = [];
      createdAt            = now;
      var updatedAt        = now;
      isVideo              = isVideo;
    };
    callsState.add(callId, cs);
    callId
  };

  public func acceptCall(
    callsState : CallsState,
    caller     : CommonTypes.UserId,
    callId     : CallTypes.CallId,
    sdpAnswer  : Text,
  ) : () {
    let cs = switch (callsState.get(callId)) {
      case null Runtime.trap("Call not found");
      case (?c) c;
    };
    if (not Principal.equal(cs.calleeId, caller)) Runtime.trap("Not the callee");
    switch (cs.status) {
      case (#ringing) {};
      case _ Runtime.trap("Call is not in ringing state");
    };
    cs.status    := #active;
    cs.sdpAnswer := ?sdpAnswer;
    cs.updatedAt := Time.now();
  };

  public func declineCall(
    callsState : CallsState,
    caller     : CommonTypes.UserId,
    callId     : CallTypes.CallId,
  ) : () {
    let cs = switch (callsState.get(callId)) {
      case null Runtime.trap("Call not found");
      case (?c) c;
    };
    if (not Principal.equal(cs.calleeId, caller)) Runtime.trap("Not the callee");
    cs.status    := #declined;
    cs.updatedAt := Time.now();
  };

  public func hangupCall(
    callsState : CallsState,
    caller     : CommonTypes.UserId,
    callId     : CallTypes.CallId,
  ) : () {
    let cs = switch (callsState.get(callId)) {
      case null Runtime.trap("Call not found");
      case (?c) c;
    };
    let isParticipant = Principal.equal(cs.callerId, caller) or Principal.equal(cs.calleeId, caller);
    if (not isParticipant) Runtime.trap("Not a participant");
    cs.status    := #ended;
    cs.updatedAt := Time.now();
  };

  public func addIceCandidate(
    callsState : CallsState,
    caller     : CommonTypes.UserId,
    callId     : CallTypes.CallId,
    candidate  : Text,
    isCallee   : Bool,
  ) : () {
    let cs = switch (callsState.get(callId)) {
      case null Runtime.trap("Call not found");
      case (?c) c;
    };
    let isParticipant = Principal.equal(cs.callerId, caller) or Principal.equal(cs.calleeId, caller);
    if (not isParticipant) Runtime.trap("Not a participant");
    if (isCallee) {
      cs.calleeCandidates := cs.calleeCandidates.concat([candidate]);
    } else {
      cs.callerCandidates := cs.callerCandidates.concat([candidate]);
    };
    cs.updatedAt := Time.now();
  };

  public func getCallState(
    callsState : CallsState,
    caller     : CommonTypes.UserId,
    callId     : CallTypes.CallId,
  ) : ?CallTypes.CallStatePublic {
    switch (callsState.get(callId)) {
      case null null;
      case (?cs) {
        let isParticipant = Principal.equal(cs.callerId, caller) or Principal.equal(cs.calleeId, caller);
        if (not isParticipant) Runtime.trap("Not a participant");
        ?toPublic(cs)
      };
    }
  };

  public func getPendingCall(
    callsState : CallsState,
    caller     : CommonTypes.UserId,
  ) : ?CallTypes.CallStatePublic {
    let found = callsState.entries().find(func((_, cs) : (CallTypes.CallId, CallTypes.CallState)) : Bool {
      let isRinging : Bool = switch (cs.status) { case (#ringing) true; case _ false };
      Principal.equal(cs.calleeId, caller) and isRinging
    });
    switch (found) {
      case null null;
      case (?(_, cs)) ?toPublic(cs);
    }
  };
};
