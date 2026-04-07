import Storage "mo:caffeineai-object-storage/Storage";
import Common "common";

module {
  public type Message = {
    id        : Common.MessageId;
    senderId  : Common.UserId;
    content   : Text;              // text content (empty if file only)
    file      : ?Storage.ExternalBlob;  // optional file attachment
    kind      : Common.MessageKind;
    createdAt : Common.Timestamp;
  };

  // Direct message conversation between two users
  public type DirectConversation = {
    id           : Nat;
    participants : (Common.UserId, Common.UserId);  // always sorted
    createdAt    : Common.Timestamp;
  };

  // Inbox summary for a direct conversation (for polling)
  public type DirectConversationSummary = {
    conversationId : Nat;
    otherUserId    : Common.UserId;
    otherUsername  : Text;
    lastMessage    : ?Message;
    unreadCount    : Nat;
  };

  public type SendMessageRequest = {
    content : Text;
    file    : ?Storage.ExternalBlob;
  };
};
