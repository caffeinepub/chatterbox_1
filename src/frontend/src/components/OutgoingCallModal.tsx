import { Button } from "@/components/ui/button";
import { Loader2, PhoneOff } from "lucide-react";
import { Avatar } from "./Avatar";

interface OutgoingCallModalProps {
  calleeName: string;
  isVideo: boolean;
  onCancel: () => void;
}

export function OutgoingCallModal({
  calleeName,
  isVideo,
  onCancel,
}: OutgoingCallModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md"
      aria-label="Outgoing call"
      data-ocid="outgoing-call-modal"
    >
      <div className="bg-card border border-border rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6 w-72 max-w-full">
        <Avatar name={calleeName} size="lg" />

        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">{calleeName}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            <span>Calling{isVideo ? " (video)" : ""}…</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <Button
            size="icon"
            variant="destructive"
            className="size-14 rounded-full"
            onClick={onCancel}
            aria-label="Cancel call"
            data-ocid="cancel-call-btn"
          >
            <PhoneOff className="size-5" />
          </Button>
          <span className="text-xs text-muted-foreground">Cancel</span>
        </div>
      </div>
    </div>
  );
}
