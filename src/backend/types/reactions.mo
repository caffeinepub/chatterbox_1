import Common "common";

module {
  // Public reaction entry for API responses
  public type ReactionEntry = {
    emoji : Text;
    users : [Common.UserId];
  };
};
