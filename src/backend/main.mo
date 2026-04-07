import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import ProfileLib "lib/profile";
import ContactLib "lib/contacts";
import MessagingLib "lib/messaging";
import GroupLib "lib/groups";
import CallLib "lib/calls";
import TypingLib "lib/typing";
import ReactionLib "lib/reactions";
import MixinProfile "mixins/profile-api";
import MixinContacts "mixins/contacts-api";
import MixinMessaging "mixins/messaging-api";
import MixinGroups "mixins/groups-api";
import MixinCalls "mixins/calls-api";
import MixinTyping "mixins/typing-api";
import MixinReactions "mixins/reactions-api";
import MixinSearch "mixins/search-api";

actor {
  // ── Authorization ────────────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── Object storage ───────────────────────────────────────────────────────
  include MixinObjectStorage();

  // ── Profile state ────────────────────────────────────────────────────────
  let profiles : ProfileLib.State = ProfileLib.newState();
  include MixinProfile(accessControlState, profiles);

  // ── Contacts state ───────────────────────────────────────────────────────
  let contactRequests   : ContactLib.RequestsState  = ContactLib.newRequestsState();
  let contacts          : ContactLib.ContactsState  = ContactLib.newContactsState();
  include MixinContacts(accessControlState, profiles, contactRequests, contacts);

  // ── Direct messaging state ───────────────────────────────────────────────
  let conversations     : MessagingLib.ConversationsState = MessagingLib.newConversationsState();
  let directMessages    : MessagingLib.MessagesState      = MessagingLib.newMessagesState();
  let readCursors       : MessagingLib.ReadCursorsState   = MessagingLib.newReadCursorsState();
  let messagingCounters : MessagingLib.Counters           = MessagingLib.newCounters();
  include MixinMessaging(accessControlState, conversations, directMessages, readCursors, messagingCounters);

  // ── Group state ──────────────────────────────────────────────────────────
  let groups           : GroupLib.GroupsState    = GroupLib.newGroupsState();
  let groupMembers     : GroupLib.MembersState   = GroupLib.newMembersState();
  let groupMessages    : GroupLib.GroupMsgsState = GroupLib.newGroupMsgsState();
  let groupReadCursors : GroupLib.GroupCursors   = GroupLib.newGroupCursors();
  include MixinGroups(accessControlState, groups, groupMembers, groupMessages, groupReadCursors);

  // ── Calls state (in-memory only) ─────────────────────────────────────────
  let calls        : CallLib.CallsState = CallLib.newCallsState();
  let callCounters : CallLib.Counters   = CallLib.newCounters();
  include MixinCalls(accessControlState, calls, callCounters);

  // ── Typing indicators state ───────────────────────────────────────────────
  let typingState : TypingLib.TypingState = TypingLib.newTypingState();
  include MixinTyping(accessControlState, typingState);

  // ── Reactions state ───────────────────────────────────────────────────────
  let reactionsState : ReactionLib.ReactionsState = ReactionLib.newReactionsState();
  include MixinReactions(accessControlState, reactionsState);

  // ── Search ────────────────────────────────────────────────────────────────
  include MixinSearch(accessControlState, conversations, directMessages, groups, groupMembers, groupMessages);
};
