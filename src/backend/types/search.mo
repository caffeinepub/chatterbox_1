import Common "common";

module {
  public type ConversationType = {
    #direct;
    #group;
  };

  public type SearchResult = {
    messageId        : Nat;
    conversationId   : Text;
    conversationType : ConversationType;
    senderId         : Common.UserId;
    content          : Text;
    createdAt        : Common.Timestamp;
  };
};
