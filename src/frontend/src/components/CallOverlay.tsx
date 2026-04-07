import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import { useEffect, useRef } from "react";
import { Avatar } from "./Avatar";

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

interface CallOverlayProps {
  peerName: string;
  isVideo: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
  callDuration: number;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onHangup: () => void;
}

export function CallOverlay({
  peerName,
  isVideo,
  localStream,
  remoteStream,
  isMuted,
  isCameraOff,
  callDuration,
  onToggleMute,
  onToggleCamera,
  onHangup,
}: CallOverlayProps) {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <div
      className="fixed inset-0 z-[90] bg-background flex flex-col"
      aria-label="Active call"
      data-ocid="call-overlay"
    >
      {/* Remote media area */}
      <div className="flex-1 relative flex items-center justify-center bg-muted/20">
        {isVideo && remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          >
            <track kind="captions" />
          </video>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Avatar name={peerName} size="lg" />
            <p className="text-lg font-semibold text-foreground">{peerName}</p>
          </div>
        )}

        {/* Call timer */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-mono text-foreground border border-border/50">
          {formatDuration(callDuration)}
        </div>

        {/* Local video PiP */}
        {isVideo && localStream && (
          <div
            className={cn(
              "absolute bottom-4 right-4 w-32 h-24 rounded-xl overflow-hidden border-2 border-border shadow-lg",
              isCameraOff && "bg-secondary/80",
            )}
          >
            {!isCameraOff ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              >
                <track kind="captions" />
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <VideoOff className="size-6 text-muted-foreground" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-center gap-4 py-6 bg-card border-t border-border">
        <div className="flex flex-col items-center gap-1">
          <Button
            size="icon"
            variant={isMuted ? "secondary" : "outline"}
            className="size-12 rounded-full"
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
            data-ocid="toggle-mute-btn"
          >
            {isMuted ? (
              <MicOff className="size-5 text-destructive" />
            ) : (
              <Mic className="size-5" />
            )}
          </Button>
          <span className="text-[10px] text-muted-foreground">
            {isMuted ? "Unmute" : "Mute"}
          </span>
        </div>

        {isVideo && (
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant={isCameraOff ? "secondary" : "outline"}
              className="size-12 rounded-full"
              onClick={onToggleCamera}
              aria-label={isCameraOff ? "Turn on camera" : "Turn off camera"}
              data-ocid="toggle-camera-btn"
            >
              {isCameraOff ? (
                <VideoOff className="size-5 text-destructive" />
              ) : (
                <Video className="size-5" />
              )}
            </Button>
            <span className="text-[10px] text-muted-foreground">
              {isCameraOff ? "Start video" : "Stop video"}
            </span>
          </div>
        )}

        <div className="flex flex-col items-center gap-1">
          <Button
            size="icon"
            variant="destructive"
            className="size-14 rounded-full"
            onClick={onHangup}
            aria-label="Hang up"
            data-ocid="hangup-btn"
          >
            <Phone className="size-5 rotate-[135deg]" />
          </Button>
          <span className="text-[10px] text-muted-foreground">End call</span>
        </div>
      </div>
    </div>
  );
}
