module {
  public type UserId = Principal;
  public type GroupId = Nat;
  public type MessageId = Nat;
  public type Timestamp = Int;

  public type PresenceStatus = {
    #online;
    #away;
    #offline;
  };

  public type ContactStatus = {
    #pending;   // request sent, not yet accepted
    #accepted;
    #blocked;
  };

  public type MessageKind = {
    #text;
    #file;
  };
};
