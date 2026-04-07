import Common "common";

module {
  public type ContactRequest = {
    id         : Nat;
    from       : Common.UserId;
    to         : Common.UserId;
    createdAt  : Common.Timestamp;
    status     : Common.ContactStatus;
  };

  public type Contact = {
    userId    : Common.UserId;
    username  : Text;
    addedAt   : Common.Timestamp;
  };
};
