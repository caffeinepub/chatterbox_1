import type { Principal } from "@icp-sdk/core/principal";
import type { ExternalBlob } from "./backend";

export type { ExternalBlob };

export type UserId = Principal;
export type GroupId = bigint;
export type MessageId = bigint;
export type Timestamp = bigint;
export type CallId = bigint;

export enum PresenceStatus {
  away = "away",
  offline = "offline",
  online = "online",
}

export enum ContactStatus {
  pending = "pending",
  blocked = "blocked",
  accepted = "accepted",
}

export enum GroupMemberRole {
  member = "member",
  owner = "owner",
}

export enum MessageKind {
  file = "file",
  text = "text",
}

export enum UserRole {
  admin = "admin",
  user = "user",
  guest = "guest",
}

export enum CallStatus {
  active = "active",
  ringing = "ringing",
  missed = "missed",
  ended = "ended",
  declined = "declined",
}

export enum ConversationType {
  group = "group",
  direct = "direct",
}

export interface ProfilePublic {
  status: string;
  username: string;
  userId: UserId;
  presence: PresenceStatus;
  lastSeen: Timestamp;
  avatar?: ExternalBlob;
}

export interface Contact {
  username: string;
  userId: UserId;
  addedAt: Timestamp;
}

export interface ContactRequest {
  id: bigint;
  to: UserId;
  status: ContactStatus;
  from: UserId;
  createdAt: Timestamp;
}

export interface Message {
  id: MessageId;
  content: string;
  file?: ExternalBlob;
  kind: MessageKind;
  createdAt: Timestamp;
  senderId: UserId;
}

export interface DirectConversationSummary {
  otherUsername: string;
  otherUserId: UserId;
  lastMessage?: Message;
  conversationId: bigint;
  unreadCount: bigint;
}

export interface Group {
  id: GroupId;
  ownerId: UserId;
  icon?: ExternalBlob;
  name: string;
  createdAt: Timestamp;
  description: string;
}

export interface GroupMember {
  userId: UserId;
  joinedAt: Timestamp;
  role: GroupMemberRole;
  groupId: GroupId;
}

export interface GroupSummary {
  memberCount: bigint;
  lastMessage?: MessageId;
  group: Group;
  unreadCount: bigint;
}

export interface SaveProfileRequest {
  status: string;
  username: string;
  avatar?: ExternalBlob;
}

export interface SendMessageRequest {
  content: string;
  file?: ExternalBlob;
}

export interface CreateGroupRequest {
  icon?: ExternalBlob;
  name: string;
  description: string;
}

export interface EditGroupRequest {
  icon?: ExternalBlob;
  name: string;
  description: string;
}

export interface ReactionEntry {
  emoji: string;
  users: UserId[];
}

export interface CallStatePublic {
  id: CallId;
  status: CallStatus;
  callerCandidates: string[];
  createdAt: Timestamp;
  sdpOffer?: string;
  calleeId: UserId;
  callerId: UserId;
  updatedAt: Timestamp;
  calleeCandidates: string[];
  isVideo: boolean;
  sdpAnswer?: string;
}

export interface SearchResult {
  content: string;
  messageId: bigint;
  createdAt: Timestamp;
  conversationId: string;
  senderId: UserId;
  conversationType: ConversationType;
}
