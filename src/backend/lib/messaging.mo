import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import CommonTypes "../types/common";
import MessagingTypes "../types/messaging";

module {
  // conversations: conversationId → DirectConversation
  // messages: conversationId → List of Message
  // readCursors: (userId, conversationId) encoded as Text → last-read MessageId
  public type ConversationsState = Map.Map<Nat, MessagingTypes.DirectConversation>;
  public type MessagesState      = Map.Map<Nat, List.List<MessagingTypes.Message>>;
  public type ReadCursorsState   = Map.Map<Text, CommonTypes.MessageId>;

  // Mutable counters passed by reference so the mixin can atomically increment them
  public type Counters = {
    var nextConversationId : Nat;
    var nextDirectMsgId    : Nat;
  };

  public func newConversationsState() : ConversationsState {
    Map.empty<Nat, MessagingTypes.DirectConversation>();
  };

  public func newMessagesState() : MessagesState {
    Map.empty<Nat, List.List<MessagingTypes.Message>>();
  };

  public func newReadCursorsState() : ReadCursorsState {
    Map.empty<Text, CommonTypes.MessageId>();
  };

  public func newCounters() : Counters {
    { var nextConversationId = 0; var nextDirectMsgId = 0 };
  };

  // Composite key for read cursors: userId + ":" + conversationId
  func cursorKey(userId : CommonTypes.UserId, conversationId : Nat) : Text {
    userId.toText() # ":" # debug_show(conversationId);
  };

  // Sorted participant tuple — always (lower, higher) by text comparison
  func sortedParticipants(a : CommonTypes.UserId, b : CommonTypes.UserId) : (CommonTypes.UserId, CommonTypes.UserId) {
    if (a.toText() <= b.toText()) (a, b) else (b, a);
  };

  // Returns existing or creates new conversation between two users.
  // Mutates counters.nextConversationId on creation.
  public func getOrCreateConversation(
    conversationsState : ConversationsState,
    counters           : Counters,
    a                  : CommonTypes.UserId,
    b                  : CommonTypes.UserId,
  ) : Nat {
    let (p1, p2) = sortedParticipants(a, b);
    // Search for existing conversation
    let existing = conversationsState.entries()
      .find(func((_, conv) : (Nat, MessagingTypes.DirectConversation)) : Bool {
        let (c1, c2) = conv.participants;
        Principal.equal(c1, p1) and Principal.equal(c2, p2)
      });
    switch (existing) {
      case (?(id, _)) { id };
      case null {
        let convId = counters.nextConversationId;
        counters.nextConversationId += 1;
        let conv : MessagingTypes.DirectConversation = {
          id           = convId;
          participants = (p1, p2);
          createdAt    = Time.now();
        };
        conversationsState.add(convId, conv);
        convId
      };
    };
  };

  // Send a direct message into a conversation. Returns the new message ID.
  // Mutates counters.nextDirectMsgId.
  public func sendDirectMessage(
    messagesState      : MessagesState,
    conversationsState : ConversationsState,
    counters           : Counters,
    conversationId     : Nat,
    sender             : CommonTypes.UserId,
    req                : MessagingTypes.SendMessageRequest,
  ) : CommonTypes.MessageId {
    // Verify conversation exists
    switch (conversationsState.get(conversationId)) {
      case null { Runtime.trap("Conversation not found") };
      case (? _) {};
    };
    let msgId = counters.nextDirectMsgId;
    counters.nextDirectMsgId += 1;
    let msg : MessagingTypes.Message = {
      id        = msgId;
      senderId  = sender;
      content   = req.content;
      file      = req.file;
      kind      = switch (req.file) { case null #text; case (? _) #file };
      createdAt = Time.now();
    };
    switch (messagesState.get(conversationId)) {
      case null {
        let lst = List.empty<MessagingTypes.Message>();
        lst.add(msg);
        messagesState.add(conversationId, lst);
      };
      case (?lst) { lst.add(msg) };
    };
    msgId
  };

  // Retrieve messages, oldest to newest, optionally before a cursor.
  // Returns up to `limit` messages.
  public func getDirectMessages(
    messagesState  : MessagesState,
    conversationId : Nat,
    before         : ?CommonTypes.MessageId,
    limit          : Nat,
  ) : [MessagingTypes.Message] {
    switch (messagesState.get(conversationId)) {
      case null { [] };
      case (?lst) {
        let all = lst.toArray();
        // Filter to messages before the cursor
        let filtered : [MessagingTypes.Message] = switch (before) {
          case null { all };
          case (?cursor) {
            all.filter(func(m : MessagingTypes.Message) : Bool {
              m.id < cursor
            })
          };
        };
        // Take the last `limit` items (oldest-to-newest window ending just before cursor)
        let total = filtered.size();
        if (total <= limit) {
          filtered
        } else {
          filtered.sliceToArray(total - limit, total)
        }
      };
    };
  };

  // Mark messages as read up to upToMessageId for the given user in a conversation.
  public func markDirectRead(
    cursorsState   : ReadCursorsState,
    userId         : CommonTypes.UserId,
    conversationId : Nat,
    upToMessageId  : CommonTypes.MessageId,
  ) : () {
    let key = cursorKey(userId, conversationId);
    let current = switch (cursorsState.get(key)) {
      case null { 0 };
      case (?v) { v };
    };
    // Only advance the cursor, never go backwards
    if (upToMessageId > current) {
      cursorsState.add(key, upToMessageId);
    };
  };

  // Returns the number of unread messages for a user in a conversation.
  public func getUnreadDirectCount(
    messagesState  : MessagesState,
    cursorsState   : ReadCursorsState,
    userId         : CommonTypes.UserId,
    conversationId : Nat,
  ) : Nat {
    let key = cursorKey(userId, conversationId);
    let lastRead = switch (cursorsState.get(key)) {
      case null { 0 };
      case (?v) { v };
    };
    switch (messagesState.get(conversationId)) {
      case null { 0 };
      case (?lst) {
        lst.toArray().filter(func(m : MessagingTypes.Message) : Bool {
          m.id > lastRead and not Principal.equal(m.senderId, userId)
        }).size()
      };
    };
  };

  // Returns userIds who have read up to or past the given messageId in a direct conversation.
  // A user has "read" a message if their cursor >= messageId.
  public func getDirectMessageReaders(
    cursorsState   : ReadCursorsState,
    conversationId : Nat,
    messageId      : CommonTypes.MessageId,
  ) : [CommonTypes.UserId] {
    let convIdText = debug_show(conversationId);
    let suffix = ":" # convIdText;
    let result = List.empty<CommonTypes.UserId>();
    for ((key, cursor) in cursorsState.entries()) {
      if (cursor >= messageId and key.endsWith(#text suffix) and key.size() > suffix.size()) {
        let keyLen    : Int = key.size().toInt();
        let suffixLen : Int = suffix.size().toInt();
        let chars  = key.toArray().sliceToArray(0, keyLen - suffixLen);
        let userIdText = Text.fromArray(chars);
        let userId = Principal.fromText(userIdText);
        result.add(userId);
      };
    };
    result.toArray()
  };

  // Build conversation summaries for polling inbox.
  public func getDirectConversationSummaries(
    conversationsState : ConversationsState,
    messagesState      : MessagesState,
    cursorsState       : ReadCursorsState,
    userId             : CommonTypes.UserId,
  ) : [MessagingTypes.DirectConversationSummary] {
    let summaries = List.empty<MessagingTypes.DirectConversationSummary>();
    for ((convId, conv) in conversationsState.entries()) {
      let (p1, p2) = conv.participants;
      let isParticipant = Principal.equal(p1, userId) or Principal.equal(p2, userId);
      if (isParticipant) {
        let otherId = if (Principal.equal(p1, userId)) p2 else p1;
        let unread = getUnreadDirectCount(messagesState, cursorsState, userId, convId);
        let lastMsg : ?MessagingTypes.Message = switch (messagesState.get(convId)) {
          case null { null };
          case (?lst) { lst.last() };
        };
        summaries.add({
          conversationId = convId;
          otherUserId    = otherId;
          otherUsername  = otherId.toText();
          lastMessage    = lastMsg;
          unreadCount    = unread;
        });
      };
    };
    summaries.toArray()
  };
};
