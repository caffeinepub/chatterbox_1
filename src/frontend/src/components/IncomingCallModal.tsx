import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Video } from "lucide-react";
import type { CallStatePublic } from "../types";
import { Avatar } from "./Avatar";

interface IncomingCallModalProps {
  callState: CallStatePublic;
  callerName: string;
  onAccept: () => void;
  onDecline: () => void;
  isAccepting: boolean;
}

export function IncomingCallModal({
  callState,
  callerName,
  onAccept,
  onDecline,
  isAccepting,
}: IncomingCallModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md"
      aria-label="Incoming call"
      data-ocid="incoming-call-modal"
    >
      <div className="bg-card border border-border rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6 w-72 max-w-full">
        {/* Pulse ring */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping scale-125" />
          <Avatar name={callerName} size="lg" />
        </div>

        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Incoming {callState.isVideo ? "Video" : "Audio"} Call
          </p>
          <p className="text-lg font-semibold text-foreground">{callerName}</p>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-1.5">
            <Button
              size="icon"
              variant="destructive"
              className="size-14 rounded-full text-lg"
              onClick={onDecline}
              disabled={isAccepting}
              aria-label="Decline call"
              data-ocid="decline-call-btn"
            >
              <PhoneOff className="size-5" />
            </Button>
            <span className="text-xs text-muted-foreground">Decline</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <Button
              size="icon"
              className="size-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={onAccept}
              disabled={isAccepting}
              aria-label="Accept call"
              data-ocid="accept-call-btn"
            >
              {callState.isVideo ? (
                <Video className="size-5" />
              ) : (
                <Phone className="size-5" />
              )}
            </Button>
            <span className="text-xs text-muted-foreground">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
}
