import type { backendInterface } from "../backend.d";
import {
  CallStatus,
  ContactStatus,
  ConversationType,
  GroupMemberRole,
  MessageKind,
  PresenceStatus,
  UserRole,
} from "../backend.d";

// Mock Principal-like object
type MockPrincipal = {
  isAnonymous: () => boolean;
  toText: () => string;
  toString: () => string;
  toUint8Array: () => Uint8Array;
  compareTo: () => "eq";
  toJSON: () => string;
};

function makePrincipal(id: string): MockPrincipal {
  return {
    isAnonymous: () => false,
    toText: () => id,
    toString: () => id,
    toUint8Array: () => new Uint8Array(29),
    compareTo: () => "eq" as const,
    toJSON: () => id,
  };
}

const USER_ID = makePrincipal("aaaaa-aa");
const OTHER_ID_1 = makePrincipal("bbbbb-bb");
const OTHER_ID_2 = makePrincipal("ccccc-cc");

const NOW = BigInt(Date.now()) * BigInt(1_000_000);

export const mockBackend = {
  acceptCall: async () => {},
  acceptContactRequest: async () => {},
  addGroupMember: async () => {},
  addIceCandidate: async () => {},
  addReaction: async () => {},
  assignCallerUserRole: async () => {},
  createCall: async () => BigInt(1),
  createGroup: async () => BigInt(1),
  declineCall: async () => {},
  editGroup: async () => {},
  findUserByUsername: async (username) => ({
    status: "Available",
    username,
    userId: OTHER_ID_1,
    presence: PresenceStatus.online,
    lastSeen: NOW,
  }),
  getCallState: async () => null,
  getCallerUserProfile: async () => ({
    status: "Available",
    username: "you",
    userId: USER_ID,
    presence: PresenceStatus.online,
    lastSeen: NOW,
  }),
  getCallerUserRole: async () => UserRole.user,
  getContacts: async () => [
    {
      username: "alex",
      userId: OTHER_ID_1,
      addedAt: NOW - BigInt(86400) * BigInt(1_000_000_000),
    },
    {
      username: "morgan",
      userId: OTHER_ID_2,
      addedAt: NOW - BigInt(172800) * BigInt(1_000_000_000),
    },
  ],
  getDirectConversationSummaries: async () => [
    {
      otherUsername: "alex",
      otherUserId: OTHER_ID_1,
      lastMessage: {
        id: BigInt(2),
        content: "Sounds good, see you then!",
        kind: MessageKind.text,
        createdAt: NOW - BigInt(300) * BigInt(1_000_000_000),
        senderId: OTHER_ID_1,
      },
      conversationId: BigInt(1),
      unreadCount: BigInt(2),
    },
    {
      otherUsername: "morgan",
      otherUserId: OTHER_ID_2,
      lastMessage: {
        id: BigInt(4),
        content: "Did you see the latest update?",
        kind: MessageKind.text,
        createdAt: NOW - BigInt(3600) * BigInt(1_000_000_000),
        senderId: OTHER_ID_2,
      },
      conversationId: BigInt(2),
      unreadCount: BigInt(0),
    },
  ],
  getDirectMessageReaders: async () => [],
  getDirectMessages: async () => [
    {
      id: BigInt(1),
      content: "Hey! Are we still meeting tomorrow?",
      kind: MessageKind.text,
      createdAt: NOW - BigInt(600) * BigInt(1_000_000_000),
      senderId: OTHER_ID_1,
    },
    {
      id: BigInt(2),
      content: "Absolutely, I'll be there at 10am.",
      kind: MessageKind.text,
      createdAt: NOW - BigInt(500) * BigInt(1_000_000_000),
      senderId: USER_ID,
    },
    {
      id: BigInt(3),
      content: "Sounds good, see you then!",
      kind: MessageKind.text,
      createdAt: NOW - BigInt(300) * BigInt(1_000_000_000),
      senderId: OTHER_ID_1,
    },
  ],
  getGroup: async () => ({
    id: BigInt(1),
    ownerId: USER_ID,
    name: "Design Team",
    createdAt: NOW - BigInt(604800) * BigInt(1_000_000_000),
    description: "Design team sync and discussions",
  }),
  getGroupMembers: async () => [
    {
      userId: USER_ID,
      joinedAt: NOW - BigInt(604800) * BigInt(1_000_000_000),
      role: GroupMemberRole.owner,
      groupId: BigInt(1),
    },
    {
      userId: OTHER_ID_1,
      joinedAt: NOW - BigInt(604800) * BigInt(1_000_000_000),
      role: GroupMemberRole.member,
      groupId: BigInt(1),
    },
  ],
  getGroupMessageReaders: async () => [],
  getGroupMessages: async () => [
    {
      id: BigInt(10),
      content: "Welcome to Design Team chat!",
      kind: MessageKind.text,
      createdAt: NOW - BigInt(86400) * BigInt(1_000_000_000),
      senderId: USER_ID,
    },
    {
      id: BigInt(11),
      content: "Thanks for adding me!",
      kind: MessageKind.text,
      createdAt: NOW - BigInt(82800) * BigInt(1_000_000_000),
      senderId: OTHER_ID_1,
    },
  ],
  getOrCreateDirectConversation: async () => BigInt(1),
  getPendingCall: async () => null,
  getPendingContactRequests: async () => [],
  getReactions: async () => [],
  getSentContactRequests: async () => [],
  getTypingUsers: async () => [],
  getUnreadDirectCount: async () => BigInt(0),
  getUserGroups: async () => [
    {
      memberCount: BigInt(2),
      lastMessage: BigInt(11),
      group: {
        id: BigInt(1),
        ownerId: USER_ID,
        name: "Design Team",
        createdAt: NOW - BigInt(604800) * BigInt(1_000_000_000),
        description: "Design team sync and discussions",
      },
      unreadCount: BigInt(1),
    },
  ],
  getUserProfile: async () => ({
    status: "Available",
    username: "alex",
    userId: OTHER_ID_1,
    presence: PresenceStatus.online,
    lastSeen: NOW,
  }),
  hangupCall: async () => {},
  heartbeat: async () => {},
  isCallerAdmin: async () => false,
  leaveGroup: async () => {},
  markDirectRead: async () => {},
  markGroupRead: async () => {},
  rejectContactRequest: async () => {},
  removeContact: async () => {},
  removeGroupMember: async () => {},
  removeReaction: async () => {},
  saveCallerUserProfile: async () => {},
  searchMessages: async () => [
    {
      content: "Sounds good, see you then!",
      messageId: BigInt(2),
      createdAt: NOW - BigInt(300) * BigInt(1_000_000_000),
      conversationId: "1",
      senderId: OTHER_ID_1,
      conversationType: ConversationType.direct,
    },
  ],
  sendContactRequest: async () => BigInt(1),
  sendDirectMessage: async () => BigInt(100),
  sendGroupMessage: async () => BigInt(100),
  setPresence: async () => {},
  setTypingStatus: async () => {},
} as unknown as backendInterface;

// Suppress unused import warnings
void ContactStatus;
void CallStatus;
