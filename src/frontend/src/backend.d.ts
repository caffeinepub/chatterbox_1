import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface SearchResult {
    content: string;
    messageId: bigint;
    createdAt: Timestamp;
    conversationId: string;
    senderId: UserId;
    conversationType: ConversationType;
}
export type Timestamp = bigint;
export interface SaveProfileRequest {
    status: string;
    username: string;
    avatar?: ExternalBlob;
}
export interface Group {
    id: GroupId;
    ownerId: UserId;
    icon?: ExternalBlob;
    name: string;
    createdAt: Timestamp;
    description: string;
}
export type GroupId = bigint;
export interface SendMessageRequest {
    content: string;
    file?: ExternalBlob;
}
export interface GroupSummary {
    memberCount: bigint;
    lastMessage?: MessageId;
    group: Group;
    unreadCount: bigint;
}
export interface ContactRequest {
    id: bigint;
    to: UserId;
    status: ContactStatus;
    from: UserId;
    createdAt: Timestamp;
}
export interface EditGroupRequest {
    icon?: ExternalBlob;
    name: string;
    description: string;
}
export interface GroupMember {
    userId: UserId;
    joinedAt: Timestamp;
    role: GroupMemberRole;
    groupId: GroupId;
}
export interface Contact {
    username: string;
    userId: UserId;
    addedAt: Timestamp;
}
export interface CreateGroupRequest {
    icon?: ExternalBlob;
    name: string;
    description: string;
}
export interface CallStatePublic {
    id: CallId;
    status: CallStatus;
    callerCandidates: Array<string>;
    createdAt: Timestamp;
    sdpOffer?: string;
    calleeId: UserId;
    callerId: UserId;
    updatedAt: Timestamp;
    calleeCandidates: Array<string>;
    isVideo: boolean;
    sdpAnswer?: string;
}
export type UserId = Principal;
export interface ReactionEntry {
    emoji: string;
    users: Array<UserId>;
}
export type MessageId = bigint;
export interface DirectConversationSummary {
    otherUsername: string;
    otherUserId: UserId;
    lastMessage?: Message;
    conversationId: bigint;
    unreadCount: bigint;
}
export interface Message {
    id: MessageId;
    content: string;
    file?: ExternalBlob;
    kind: MessageKind;
    createdAt: Timestamp;
    senderId: UserId;
}
export type CallId = bigint;
export interface ProfilePublic {
    status: string;
    username: string;
    userId: UserId;
    presence: PresenceStatus;
    lastSeen: Timestamp;
    avatar?: ExternalBlob;
}
export enum CallStatus {
    active = "active",
    ringing = "ringing",
    missed = "missed",
    ended = "ended",
    declined = "declined"
}
export enum ContactStatus {
    pending = "pending",
    blocked = "blocked",
    accepted = "accepted"
}
export enum ConversationType {
    group = "group",
    direct = "direct"
}
export enum GroupMemberRole {
    member = "member",
    owner = "owner"
}
export enum MessageKind {
    file = "file",
    text = "text"
}
export enum PresenceStatus {
    away = "away",
    offline = "offline",
    online = "online"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptCall(callId: CallId, sdpAnswer: string): Promise<void>;
    acceptContactRequest(requestId: bigint): Promise<void>;
    addGroupMember(groupId: GroupId, newMember: UserId): Promise<void>;
    addIceCandidate(callId: CallId, candidate: string, isCallee: boolean): Promise<void>;
    addReaction(conversationId: string, messageId: bigint, emoji: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCall(calleeId: UserId, sdpOffer: string, isVideo: boolean): Promise<CallId>;
    createGroup(req: CreateGroupRequest): Promise<GroupId>;
    declineCall(callId: CallId): Promise<void>;
    editGroup(groupId: GroupId, req: EditGroupRequest): Promise<void>;
    findUserByUsername(username: string): Promise<ProfilePublic | null>;
    getCallState(callId: CallId): Promise<CallStatePublic | null>;
    getCallerUserProfile(): Promise<ProfilePublic | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContacts(): Promise<Array<Contact>>;
    getDirectConversationSummaries(): Promise<Array<DirectConversationSummary>>;
    getDirectMessageReaders(conversationId: bigint, messageId: MessageId): Promise<Array<UserId>>;
    getDirectMessages(conversationId: bigint, before: MessageId | null, limit: bigint): Promise<Array<Message>>;
    getGroup(groupId: GroupId): Promise<Group | null>;
    getGroupMembers(groupId: GroupId): Promise<Array<GroupMember>>;
    getGroupMessageReaders(groupId: GroupId, messageId: MessageId): Promise<Array<UserId>>;
    getGroupMessages(groupId: GroupId, before: MessageId | null, limit: bigint): Promise<Array<Message>>;
    getOrCreateDirectConversation(other: UserId): Promise<bigint>;
    getPendingCall(): Promise<CallStatePublic | null>;
    getPendingContactRequests(): Promise<Array<ContactRequest>>;
    getReactions(conversationId: string, messageId: bigint): Promise<Array<ReactionEntry>>;
    getSentContactRequests(): Promise<Array<ContactRequest>>;
    getTypingUsers(conversationId: string): Promise<Array<UserId>>;
    getUnreadDirectCount(conversationId: bigint): Promise<bigint>;
    getUserGroups(): Promise<Array<GroupSummary>>;
    getUserProfile(userId: UserId): Promise<ProfilePublic | null>;
    hangupCall(callId: CallId): Promise<void>;
    heartbeat(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    leaveGroup(groupId: GroupId): Promise<void>;
    markDirectRead(conversationId: bigint, upToMessageId: MessageId): Promise<void>;
    markGroupRead(groupId: GroupId, upToMsgId: MessageId): Promise<void>;
    rejectContactRequest(requestId: bigint): Promise<void>;
    removeContact(target: UserId): Promise<void>;
    removeGroupMember(groupId: GroupId, target: UserId): Promise<void>;
    removeReaction(conversationId: string, messageId: bigint, emoji: string): Promise<void>;
    saveCallerUserProfile(req: SaveProfileRequest): Promise<void>;
    searchMessages(searchTerm: string): Promise<Array<SearchResult>>;
    sendContactRequest(target: UserId): Promise<bigint>;
    sendDirectMessage(conversationId: bigint, req: SendMessageRequest): Promise<MessageId>;
    sendGroupMessage(groupId: GroupId, req: SendMessageRequest): Promise<MessageId>;
    setPresence(presence: PresenceStatus): Promise<void>;
    setTypingStatus(conversationId: string, isTyping: boolean): Promise<void>;
}
