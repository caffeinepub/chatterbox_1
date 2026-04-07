import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  Loader2,
  Search,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { Avatar } from "../components/Avatar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAddGroupMember, useCreateGroup } from "../hooks/useGroups";
import { useFindUserByUsername } from "../hooks/useProfile";
import type { ProfilePublic } from "../types";

export function NewGroupPage() {
  const navigate = useNavigate();
  const createGroup = useCreateGroup();
  const addMember = useAddGroupMember();
  const findUser = useFindUserByUsername();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Member search state
  const [memberQuery, setMemberQuery] = useState("");
  const [memberResult, setMemberResult] = useState<
    ProfilePublic | null | undefined
  >(undefined);
  const [pendingMembers, setPendingMembers] = useState<ProfilePublic[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    const url = URL.createObjectURL(file);
    setIconPreview(url);
  };

  const handleMemberSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!memberQuery.trim()) return;
    setMemberResult(undefined);
    const user = await findUser.mutateAsync(memberQuery.trim());
    setMemberResult(user);
  };

  const addPendingMember = (user: ProfilePublic) => {
    if (
      !pendingMembers.some((m) => m.userId.toText() === user.userId.toText())
    ) {
      setPendingMembers((prev) => [...prev, user]);
    }
    setMemberQuery("");
    setMemberResult(undefined);
  };

  const removePendingMember = (userId: string) => {
    setPendingMembers((prev) =>
      prev.filter((m) => m.userId.toText() !== userId),
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    let icon: ExternalBlob | undefined;
    if (iconFile) {
      const bytes = new Uint8Array(await iconFile.arrayBuffer());
      icon = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setUploadProgress(pct),
      );
    }

    try {
      const groupId = await createGroup.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        icon,
      });

      // Add initial members in parallel
      if (pendingMembers.length > 0) {
        await Promise.allSettled(
          pendingMembers.map((m) =>
            addMember.mutateAsync({ groupId, newMember: m.userId }),
          ),
        );
      }

      toast.success(`Group "${name.trim()}" created!`);
      navigate({ to: "/groups/$id", params: { id: groupId.toString() } });
    } catch {
      toast.error("Failed to create group. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && name.trim()) {
      e.preventDefault();
      handleCreate();
    }
  };

  const isSubmitting = createGroup.isPending || addMember.isPending;

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => navigate({ to: "/groups" })}
          aria-label="Go back to groups"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="font-display font-semibold text-lg text-foreground">
          New Group
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-6 py-8">
          <div className="flex flex-col gap-7">
            {/* Icon picker */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative group size-24 rounded-2xl overflow-hidden bg-secondary/60 border-2 border-dashed border-border hover:border-primary/50 transition-smooth cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Upload group icon"
                data-ocid="group-icon-upload"
              >
                {iconPreview ? (
                  <>
                    <img
                      src={iconPreview}
                      alt="Group icon preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                      <Camera className="size-6 text-foreground" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1.5 h-full">
                    <Users className="size-8 text-muted-foreground/40" />
                    <Camera className="size-4 text-muted-foreground/50" />
                  </div>
                )}
              </button>
              <p className="text-xs text-muted-foreground">
                Click to upload icon (optional)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleIconChange}
                tabIndex={-1}
              />
            </div>

            {/* Upload progress */}
            {isSubmitting &&
              iconFile &&
              uploadProgress > 0 &&
              uploadProgress < 100 && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Uploading icon…</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

            {/* Group Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="group-name" className="font-medium">
                Group Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="group-name"
                data-ocid="group-name-input"
                placeholder="e.g. Design Team, Project Alpha, Family Chat"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-secondary/30"
                maxLength={80}
                autoFocus
              />
              <p className="text-xs text-muted-foreground text-right">
                {name.length}/80
              </p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="group-description" className="font-medium">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="group-description"
                data-ocid="group-description-input"
                placeholder="What's this group about? Give members context."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-secondary/30 resize-none"
                rows={3}
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground text-right">
                {description.length}/300
              </p>
            </div>

            {/* ── Add Initial Members (optional) ──────────────────────── */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Label className="font-medium">
                  Add Members{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
              </div>
              <p className="text-xs text-muted-foreground -mt-1">
                Search by username. You can also add members later from the
                group page.
              </p>

              {/* Pending members */}
              {pendingMembers.length > 0 && (
                <div
                  className="flex flex-col gap-2"
                  data-ocid="pending-members-list"
                >
                  {pendingMembers.map((m) => (
                    <div
                      key={m.userId.toText()}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/40 border border-border"
                    >
                      <Avatar
                        name={m.username}
                        size="sm"
                        presence={m.presence}
                      />
                      <span className="flex-1 text-sm font-medium text-foreground truncate">
                        {m.username}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() => removePendingMember(m.userId.toText())}
                        aria-label={`Remove ${m.username}`}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Search input */}
              <form onSubmit={handleMemberSearch} className="flex gap-2">
                <Input
                  data-ocid="member-search-input"
                  placeholder="Enter exact username…"
                  value={memberQuery}
                  onChange={(e) => {
                    setMemberQuery(e.target.value);
                    setMemberResult(undefined);
                  }}
                  className="flex-1 bg-secondary/30"
                />
                <Button
                  type="submit"
                  variant="outline"
                  disabled={findUser.isPending || !memberQuery.trim()}
                  data-ocid="member-search-btn"
                  className="flex-shrink-0"
                >
                  {findUser.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Search className="size-4" />
                  )}
                </Button>
              </form>

              {/* Search result */}
              {findUser.isSuccess && memberResult === null && (
                <p className="text-xs text-muted-foreground px-1">
                  No user found with that username.
                </p>
              )}
              {memberResult != null && (
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-card"
                  data-ocid="member-search-result"
                >
                  <Avatar
                    name={memberResult.username}
                    size="sm"
                    presence={memberResult.presence}
                  />
                  <span className="flex-1 text-sm font-medium text-foreground truncate">
                    {memberResult.username}
                  </span>
                  {pendingMembers.some(
                    (m) => m.userId.toText() === memberResult.userId.toText(),
                  ) ? (
                    <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted">
                      Added
                    </span>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addPendingMember(memberResult)}
                      data-ocid="add-member-btn"
                    >
                      <UserPlus className="size-3.5 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              onClick={handleCreate}
              disabled={isSubmitting || !name.trim()}
              data-ocid="create-group-submit-btn"
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Creating…
                </>
              ) : pendingMembers.length > 0 ? (
                <>
                  <UserMinus className="size-4 mr-2" />
                  Create Group with {pendingMembers.length} member
                  {pendingMembers.length !== 1 ? "s" : ""}
                </>
              ) : (
                "Create Group"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
