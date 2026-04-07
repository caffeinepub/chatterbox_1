import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Camera,
  Check,
  Loader2,
  LogOut,
  Paperclip,
  Pencil,
  Search,
  Send,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { Avatar } from "../components/Avatar";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { GroupMessageWithExtras } from "../components/MessageWithExtras";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import {
  useAddGroupMember,
  useEditGroup,
  useGroup,
  useGroupMembers,
  useGroupMessages,
  useLeaveGroup,
  useMarkGroupRead,
  useRemoveGroupMember,
  useSendGroupMessage,
} from "../hooks/useGroups";
import { useFindUserByUsername } from "../hooks/useProfile";
import { useTypingIndicator } from "../hooks/useTypingIndicator";
import { GroupMemberRole, PresenceStatus } from "../types";
import type { ProfilePublic } from "../types";

// ── Edit Group Dialog ────────────────────────────────────────────────────────

interface EditGroupDialogProps {
  groupId: bigint;
  initialName: string;
  initialDescription: string;
  initialIconUrl?: string;
  open: boolean;
  onClose: () => void;
}

function EditGroupDialog({
  groupId,
  initialName,
  initialDescription,
  initialIconUrl,
  open,
  onClose,
}: EditGroupDialogProps) {
  const editGroup = useEditGroup();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(
    initialIconUrl ?? null,
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    let icon: ExternalBlob | undefined;
    if (iconFile) {
      const bytes = new Uint8Array(await iconFile.arrayBuffer());
      icon = ExternalBlob.fromBytes(bytes);
    }
    try {
      await editGroup.mutateAsync({
        groupId,
        req: { name: name.trim(), description: description.trim(), icon },
      });
      toast.success("Group updated!");
      onClose();
    } catch {
      toast.error("Failed to update group.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>
            Update your group's name, description, or icon.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 py-2">
          {/* Icon */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative group size-20 rounded-2xl overflow-hidden bg-secondary/60 border-2 border-dashed border-border hover:border-primary/50 transition-smooth cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Change group icon"
            >
              {iconPreview ? (
                <>
                  <img
                    src={iconPreview}
                    alt="Group icon"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                    <Camera className="size-5 text-foreground" />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Users className="size-7 text-muted-foreground/40" />
                </div>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleIconChange}
            />
          </div>
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-name">Group Name</Label>
            <Input
              id="edit-name"
              data-ocid="edit-group-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
            />
          </div>
          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea
              id="edit-desc"
              data-ocid="edit-group-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="resize-none"
              maxLength={300}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={editGroup.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={editGroup.isPending || !name.trim()}
            data-ocid="edit-group-save-btn"
          >
            {editGroup.isPending ? (
              <Loader2 className="size-4 animate-spin mr-1.5" />
            ) : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Add Member Dialog ────────────────────────────────────────────────────────

interface AddMemberDialogProps {
  groupId: bigint;
  open: boolean;
  onClose: () => void;
}

function AddMemberDialog({ groupId, open, onClose }: AddMemberDialogProps) {
  const findUser = useFindUserByUsername();
  const addMember = useAddGroupMember();
  const [username, setUsername] = useState("");
  const [found, setFound] = useState<ProfilePublic | null | undefined>(
    undefined,
  );

  const handleSearch = async () => {
    if (!username.trim()) return;
    const result = await findUser.mutateAsync(username.trim());
    setFound(result);
  };

  const handleAdd = async () => {
    if (!found) return;
    try {
      await addMember.mutateAsync({ groupId, newMember: found.userId });
      toast.success(`${found.username} added to the group!`);
      onClose();
      setUsername("");
      setFound(undefined);
    } catch {
      toast.error("Failed to add member. They may already be in the group.");
    }
  };

  const handleClose = () => {
    setUsername("");
    setFound(undefined);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Search by username to add someone to this group.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex gap-2">
            <Input
              data-ocid="add-member-username-input"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setFound(undefined);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleSearch}
              disabled={findUser.isPending || !username.trim()}
              aria-label="Search user"
              data-ocid="search-member-btn"
            >
              {findUser.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
            </Button>
          </div>

          {found === null && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No user found with that username.
            </p>
          )}

          {found && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
              <Avatar
                name={found.username}
                size="sm"
                presence={found.presence}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {found.username}
                </p>
                <StatusBadge
                  presence={found.presence ?? PresenceStatus.offline}
                  showLabel
                />
              </div>
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={addMember.isPending}
                data-ocid="confirm-add-member-btn"
              >
                {addMember.isPending ? (
                  <Loader2 className="size-3 animate-spin mr-1" />
                ) : (
                  <Check className="size-3 mr-1" />
                )}
                Add
              </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Leave Confirm Dialog ─────────────────────────────────────────────────────

interface LeaveConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLeaving: boolean;
}

function LeaveConfirmDialog({
  open,
  onConfirm,
  onCancel,
  isLeaving,
}: LeaveConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Leave Group?</DialogTitle>
          <DialogDescription>
            You'll stop receiving messages from this group. You can be
            re-invited by the owner.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onCancel} disabled={isLeaving}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLeaving}
            data-ocid="confirm-leave-group-btn"
          >
            {isLeaving ? (
              <Loader2 className="size-4 animate-spin mr-1.5" />
            ) : null}
            Leave Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Members Panel ────────────────────────────────────────────────────────────

interface MembersPanelProps {
  groupId: bigint;
  selfId: string;
  isOwner: boolean;
  onClose: () => void;
  onEditGroup: () => void;
  onAddMember: () => void;
  onLeave: () => void;
}

function MembersPanel({
  groupId,
  selfId,
  isOwner,
  onClose,
  onEditGroup,
  onAddMember,
  onLeave,
}: MembersPanelProps) {
  const { data: members = [] } = useGroupMembers(groupId);
  const removeGroupMember = useRemoveGroupMember();
  const { data: group } = useGroup(groupId);

  const handleRemove = async (userId: string, username: string) => {
    try {
      const { Principal } = await import("@icp-sdk/core/principal");
      await removeGroupMember.mutateAsync({
        groupId,
        target: Principal.fromText(userId),
      });
      toast.success(`${username} removed from group.`);
    } catch {
      toast.error("Failed to remove member.");
    }
  };

  return (
    <aside
      className="w-72 border-l border-border bg-card flex flex-col flex-shrink-0"
      data-ocid="members-panel"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
        <p className="text-sm font-semibold text-foreground">Group Info</p>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onClose}
          aria-label="Close panel"
        >
          <X className="size-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 flex flex-col gap-4">
          {/* Group summary */}
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="size-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center overflow-hidden">
              {group?.icon ? (
                <img
                  src={group.icon.getDirectURL()}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="size-7 text-primary/70" />
              )}
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground text-sm">
                {group?.name}
              </p>
              {group?.description && (
                <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px]">
                  {group.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1.5">
            {isOwner && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={onEditGroup}
                  data-ocid="edit-group-btn"
                >
                  <Pencil className="size-3.5" />
                  Edit Group
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={onAddMember}
                  data-ocid="add-member-btn"
                >
                  <UserPlus className="size-3.5" />
                  Add Member
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:border-destructive/40"
              onClick={onLeave}
              data-ocid="leave-group-btn"
            >
              <LogOut className="size-3.5" />
              Leave Group
            </Button>
          </div>

          {/* Members list */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Members · {members.length}
            </p>
            <div className="flex flex-col gap-0.5">
              {members.map((m) => {
                const userId = m.userId.toText();
                const isMe = userId === selfId;
                const isMemberOwner = m.role === GroupMemberRole.owner;
                const shortId = `${userId.slice(0, 6)}…${userId.slice(-4)}`;

                return (
                  <div
                    key={userId}
                    data-ocid="member-row"
                    className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-secondary/60 transition-smooth group"
                  >
                    <Avatar name={shortId} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-medium text-foreground truncate">
                          {shortId}
                        </p>
                        {isMe && (
                          <span className="text-[9px] font-semibold text-primary/70 bg-primary/10 px-1 rounded">
                            You
                          </span>
                        )}
                      </div>
                      {isMemberOwner && (
                        <span className="text-[10px] text-primary font-medium">
                          Owner
                        </span>
                      )}
                    </div>
                    {isOwner && !isMe && !isMemberOwner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 opacity-0 group-hover:opacity-100 transition-smooth text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(userId, shortId)}
                        aria-label={`Remove ${shortId}`}
                        data-ocid="remove-member-btn"
                        disabled={removeGroupMember.isPending}
                      >
                        <UserMinus className="size-3" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}

// ── Main GroupChatPage ───────────────────────────────────────────────────────

export function GroupChatPage() {
  const { id } = useParams({ from: "/groups/$id" });
  const groupId = BigInt(id);
  const navigate = useNavigate();
  const { principal } = useAuth();
  const selfId = principal?.toText() ?? "";

  const { data: group } = useGroup(groupId);
  const { data: members = [] } = useGroupMembers(groupId);
  const { data: messages = [], isLoading } = useGroupMessages(groupId);
  const sendMessage = useSendGroupMessage();
  const leaveGroup = useLeaveGroup();
  const markRead = useMarkGroupRead();

  const groupIdStr = id;
  const typingConvId = `group:${groupIdStr}`;
  const { typingUsers, onKeydown, onStopTyping } =
    useTypingIndicator(typingConvId);

  const [text, setText] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileAttachRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const memberMap = Object.fromEntries(
    members.map((m) => [m.userId.toText(), m]),
  );
  const selfMember = memberMap[selfId];
  const isOwner = selfMember?.role === GroupMemberRole.owner;

  const lastMsgId = messages[messages.length - 1]?.id ?? null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lastMsgId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: markRead is stable mutation fn
  useEffect(() => {
    if (lastMsgId !== null) {
      markRead.mutate({ groupId, upToMsgId: lastMsgId });
    }
  }, [lastMsgId, groupId]);

  const handleSend = async () => {
    const content = text.trim();
    if (!content && !attachedFile) return;
    setText("");
    onStopTyping();

    let file: ExternalBlob | undefined;
    if (attachedFile) {
      const bytes = new Uint8Array(await attachedFile.arrayBuffer());
      file = ExternalBlob.fromBytes(bytes);
      setAttachedFile(null);
    }

    sendMessage.mutate({
      groupId,
      req: { content: content || attachedFile?.name || "", file },
    });
  };

  const handleLeaveConfirm = async () => {
    try {
      await leaveGroup.mutateAsync(groupId);
      toast.success("You've left the group.");
      navigate({ to: "/groups" });
    } catch {
      toast.error("Failed to leave group.");
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      toast.info(`${file.name} ready to send`);
    }
  };

  const getSenderName = (senderId: string): string => {
    return `${senderId.slice(0, 6)}…${senderId.slice(-4)}`;
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Chat area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex items-center gap-3 px-5 py-3 border-b border-border bg-card flex-shrink-0">
          <div className="size-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {group?.icon ? (
              <img
                src={group.icon.getDirectURL()}
                alt={group.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Users className="size-4 text-primary/70" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {group?.name ?? "Loading…"}
            </p>
            <p className="text-xs text-muted-foreground">
              {members.length} member{members.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setShowPanel((v) => !v)}
            aria-label={showPanel ? "Hide group info" : "Show group info"}
            data-ocid="toggle-panel-btn"
          >
            <Users className="size-4" />
          </Button>
        </header>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 py-4"
          data-ocid="messages-scroll-area"
        >
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : messages.length === 0 ? (
            <EmptyState
              icon={<Users className="size-6" />}
              title="No messages yet"
              description="Be the first to say something!"
              className="h-full"
            />
          ) : (
            <div className="flex flex-col gap-2.5">
              {messages.map((msg) => (
                <GroupMessageWithExtras
                  key={msg.id.toString()}
                  message={msg}
                  isSelf={msg.senderId.toText() === selfId}
                  selfId={selfId}
                  showSender
                  senderName={getSenderName(msg.senderId.toText())}
                  groupId={id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Typing indicator */}
        {typingUsers.filter((u) => u.toText() !== selfId).length > 0 && (
          <div
            className="px-4 py-1.5 bg-background border-t border-border/50 flex-shrink-0"
            data-ocid="typing-indicator"
          >
            <p className="text-xs text-muted-foreground italic">
              {typingUsers.filter((u) => u.toText() !== selfId).length === 1
                ? "Someone is typing…"
                : "Several people are typing…"}
            </p>
          </div>
        )}

        {/* File attachment indicator */}
        {attachedFile && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-t border-primary/20">
            <Paperclip className="size-3.5 text-primary" />
            <span className="text-xs text-primary font-medium truncate flex-1">
              {attachedFile.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-5"
              onClick={() => setAttachedFile(null)}
              aria-label="Remove attachment"
            >
              <X className="size-3" />
            </Button>
          </div>
        )}

        {/* Input bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-card flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground size-8 flex-shrink-0"
            aria-label="Attach file"
            data-ocid="attach-file-btn"
            onClick={() => fileAttachRef.current?.click()}
          >
            <Paperclip className="size-4" />
          </Button>
          <input
            ref={fileAttachRef}
            type="file"
            className="sr-only"
            onChange={handleFileAttach}
          />
          <input
            data-ocid="group-message-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              } else {
                onKeydown();
              }
            }}
            onBlur={onStopTyping}
            placeholder={
              attachedFile ? "Add a caption (optional)…" : "Type a message…"
            }
            className="flex-1 min-w-0 bg-secondary/40 border border-border rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-smooth"
          />
          <Button
            size="icon"
            className="size-8 flex-shrink-0"
            onClick={handleSend}
            disabled={(!text.trim() && !attachedFile) || sendMessage.isPending}
            data-ocid="send-group-message-btn"
            aria-label="Send message"
          >
            {sendMessage.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Side panel */}
      {showPanel && (
        <MembersPanel
          groupId={groupId}
          selfId={selfId}
          isOwner={isOwner}
          onClose={() => setShowPanel(false)}
          onEditGroup={() => setShowEditDialog(true)}
          onAddMember={() => setShowAddMember(true)}
          onLeave={() => setShowLeaveConfirm(true)}
        />
      )}

      {/* Edit Group Dialog */}
      {group && (
        <EditGroupDialog
          groupId={groupId}
          initialName={group.name}
          initialDescription={group.description}
          initialIconUrl={group.icon?.getDirectURL()}
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
        />
      )}

      {/* Add Member Dialog */}
      <AddMemberDialog
        groupId={groupId}
        open={showAddMember}
        onClose={() => setShowAddMember(false)}
      />

      {/* Leave Confirm Dialog */}
      <LeaveConfirmDialog
        open={showLeaveConfirm}
        onConfirm={handleLeaveConfirm}
        onCancel={() => setShowLeaveConfirm(false)}
        isLeaving={leaveGroup.isPending}
      />
    </div>
  );
}
