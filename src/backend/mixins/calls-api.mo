import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import CommonTypes "../types/common";
import CallTypes "../types/calls";
import CallLib "../lib/calls";

mixin (
  accessControlState : AccessControl.AccessControlState,
  calls              : CallLib.CallsState,
  callCounters       : CallLib.Counters,
) {
  /// Initiate a call to another user; returns the new CallId
  public shared ({ caller }) func createCall(
    calleeId : CommonTypes.UserId,
    sdpOffer : Text,
    isVideo  : Bool,
  ) : async CallTypes.CallId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    CallLib.createCall(calls, callCounters, caller, calleeId, sdpOffer, isVideo)
  };

  /// Callee accepts a ringing call with an SDP answer
  public shared ({ caller }) func acceptCall(
    callId    : CallTypes.CallId,
    sdpAnswer : Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    CallLib.acceptCall(calls, caller, callId, sdpAnswer)
  };

  /// Callee declines a ringing call
  public shared ({ caller }) func declineCall(callId : CallTypes.CallId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    CallLib.declineCall(calls, caller, callId)
  };

  /// Either party ends the call
  public shared ({ caller }) func hangupCall(callId : CallTypes.CallId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    CallLib.hangupCall(calls, caller, callId)
  };

  /// Add an ICE candidate for peer exchange
  public shared ({ caller }) func addIceCandidate(
    callId    : CallTypes.CallId,
    candidate : Text,
    isCallee  : Bool,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    CallLib.addIceCandidate(calls, caller, callId, candidate, isCallee)
  };

  /// Poll for call state (caller or callee)
  public query ({ caller }) func getCallState(callId : CallTypes.CallId) : async ?CallTypes.CallStatePublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    CallLib.getCallState(calls, caller, callId)
  };

  /// Poll for any incoming ringing call where caller is the callee
  public query ({ caller }) func getPendingCall() : async ?CallTypes.CallStatePublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    CallLib.getPendingCall(calls, caller)
  };
};
