import Common "common";

module {
  public type CallId = Nat;

  public type CallStatus = {
    #ringing;
    #active;
    #declined;
    #ended;
    #missed;
  };

  public type CallState = {
    id               : CallId;
    callerId         : Common.UserId;
    calleeId         : Common.UserId;
    var status       : CallStatus;
    var sdpOffer     : ?Text;
    var sdpAnswer    : ?Text;
    var callerCandidates : [Text];
    var calleeCandidates : [Text];
    createdAt        : Common.Timestamp;
    var updatedAt    : Common.Timestamp;
    isVideo          : Bool;
  };

  // Shared (non-mutable) version for API responses
  public type CallStatePublic = {
    id               : CallId;
    callerId         : Common.UserId;
    calleeId         : Common.UserId;
    status           : CallStatus;
    sdpOffer         : ?Text;
    sdpAnswer        : ?Text;
    callerCandidates : [Text];
    calleeCandidates : [Text];
    createdAt        : Common.Timestamp;
    updatedAt        : Common.Timestamp;
    isVideo          : Bool;
  };
};
