import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Check, Copy, LogOut, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar } from "../components/Avatar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { useProfile, useSaveProfile } from "../hooks/useProfile";
import { PresenceStatus } from "../types";
import type { ExternalBlob } from "../types";

const presenceOptions: {
  value: PresenceStatus;
  label: string;
  dotClass: string;
}[] = [
  { value: PresenceStatus.online, label: "Online", dotClass: "bg-emerald-500" },
  { value: PresenceStatus.away, label: "Away", dotClass: "bg-amber-500" },
  {
    value: PresenceStatus.offline,
    label: "Offline",
    dotClass: "bg-muted-foreground/50",
  },
];

export function ProfilePage() {
  const { principal, logout } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const saveProfile = useSaveProfile();

  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [presence, setPresence] = useState<PresenceStatus>(
    PresenceStatus.online,
  );
  const [avatarBlob, setAvatarBlob] = useState<ExternalBlob | undefined>(
    undefined,
  );
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined,
  );
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: sync once profile loads
  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? "");
      setStatus(profile.status ?? "");
      setPresence(profile.presence ?? PresenceStatus.online);
      if (profile.avatar && !avatarPreview) {
        setAvatarPreview(profile.avatar.getDirectURL());
      }
    }
  }, [profile]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { ExternalBlob: EB } = await import("../backend");
    const bytes = new Uint8Array(await file.arrayBuffer());
    setAvatarBlob(EB.fromBytes(bytes));
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    await saveProfile.mutateAsync({
      username: username.trim(),
      status: status.trim(),
      avatar: avatarBlob,
    });
    toast.success("Profile saved!");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function copyPrincipal() {
    if (principal) {
      navigator.clipboard.writeText(principal.toText());
      toast.success("Principal ID copied to clipboard");
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Settings className="size-5 text-muted-foreground" />
          <h1 className="font-display font-semibold text-lg text-foreground">
            Profile Settings
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={logout}
          data-ocid="logout-btn"
        >
          <LogOut className="size-4 mr-1.5" />
          Sign Out
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-6 py-8">
          <form onSubmit={handleSave} className="flex flex-col gap-7">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                <Avatar
                  name={username || "?"}
                  src={avatarPreview}
                  presence={presence}
                  size="lg"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth cursor-pointer"
                  aria-label="Change avatar"
                  data-ocid="avatar-upload-trigger"
                >
                  <Camera className="size-5 text-white" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                data-ocid="avatar-file-input"
              />
              <div>
                <p className="font-display font-semibold text-base text-foreground">
                  {profile?.username || "New User"}
                </p>
                <StatusBadge presence={presence} showLabel className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1">
                  Click avatar to change photo
                </p>
              </div>
            </div>

            {/* Principal ID */}
            {principal && (
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Your Principal ID
                </Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 border border-border">
                  <p className="flex-1 text-xs text-muted-foreground font-mono truncate">
                    {principal.toText()}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6 flex-shrink-0"
                    onClick={copyPrincipal}
                    aria-label="Copy principal ID"
                    data-ocid="copy-principal-btn"
                  >
                    <Copy className="size-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this ID with others so they can add you as a contact.
                </p>
              </div>
            )}

            {/* Username */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="username-input">Username</Label>
              <Input
                id="username-input"
                data-ocid="username-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a unique username"
                maxLength={32}
                className="bg-secondary/30"
              />
            </div>

            {/* Status message */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="status-input">Status Message</Label>
              <Input
                id="status-input"
                data-ocid="status-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="What's on your mind?"
                maxLength={120}
                className="bg-secondary/30"
              />
              <p className="text-xs text-muted-foreground text-right">
                {status.length}/120
              </p>
            </div>

            {/* Presence selector */}
            <div className="flex flex-col gap-2">
              <Label>Presence</Label>
              <div className="flex gap-2">
                {presenceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPresence(opt.value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-smooth ${
                      presence === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary"
                    }`}
                    data-ocid={`presence-${opt.value}`}
                  >
                    <span className={`size-2 rounded-full ${opt.dotClass}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Save */}
            <Button
              type="submit"
              disabled={saveProfile.isPending || !username.trim()}
              className="w-full"
              data-ocid="save-profile-btn"
            >
              {saveProfile.isPending ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Saving…</span>
                </>
              ) : saved ? (
                <>
                  <Check className="size-4 mr-2" />
                  Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </Button>

            {saveProfile.isError && (
              <p className="text-sm text-destructive text-center -mt-3">
                Failed to save. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
