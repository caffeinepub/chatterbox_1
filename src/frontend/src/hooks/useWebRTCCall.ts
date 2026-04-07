import { useCallback, useEffect, useRef, useState } from "react";
import type { CallId, CallStatePublic } from "../types";
import { CallStatus } from "../types";
import { useBackend } from "./useBackend";

export type CallPhase = "idle" | "outgoing" | "incoming" | "active" | "ended";

interface UseWebRTCCallReturn {
  phase: CallPhase;
  callState: CallStatePublic | null;
  callId: CallId | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
  callDuration: number;
  startCall: (calleeId: string, isVideo: boolean) => Promise<void>;
  acceptCall: (incomingCallState: CallStatePublic) => Promise<void>;
  declineCall: (id: CallId) => Promise<void>;
  hangup: () => Promise<void>;
  toggleMute: () => void;
  toggleCamera: () => void;
}

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export function useWebRTCCall(): UseWebRTCCallReturn {
  const { actor } = useBackend();

  const [phase, setPhase] = useState<CallPhase>("idle");
  const [callState, setCallState] = useState<CallStatePublic | null>(null);
  const [callId, setCallId] = useState<CallId | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const isCalleeRef = useRef(false);
  const appliedCandidatesRef = useRef<Set<string>>(new Set());
  // Keep a ref to localStream for cleanup without stale closure
  const localStreamRef = useRef<MediaStream | null>(null);
  const phaseRef = useRef<CallPhase>("idle");

  const clearPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const clearDurationTimer = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  const cleanupResources = useCallback(() => {
    clearPolling();
    clearDurationTimer();
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      for (const t of localStreamRef.current.getTracks()) t.stop();
      localStreamRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    setCallId(null);
    setCallState(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsCameraOff(false);
    isCalleeRef.current = false;
    appliedCandidatesRef.current.clear();
  }, [clearPolling, clearDurationTimer]);

  const buildPeerConnection = useCallback(
    (stream: MediaStream): RTCPeerConnection => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      for (const track of stream.getTracks()) {
        pc.addTrack(track, stream);
      }
      const rs = new MediaStream();
      pc.ontrack = (e) => {
        rs.addTrack(e.track);
        setRemoteStream(new MediaStream(rs.getTracks()));
      };
      return pc;
    },
    [],
  );

  const pollCallState = useCallback(
    (id: CallId) => {
      pollIntervalRef.current = setInterval(async () => {
        if (!actor) return;
        try {
          const state = await actor.getCallState(id);
          if (!state) return;
          setCallState(state);

          // Apply remote ICE candidates
          if (pcRef.current) {
            const remoteCandidates = isCalleeRef.current
              ? state.callerCandidates
              : state.calleeCandidates;
            for (const c of remoteCandidates) {
              if (!appliedCandidatesRef.current.has(c)) {
                appliedCandidatesRef.current.add(c);
                try {
                  await pcRef.current.addIceCandidate(
                    new RTCIceCandidate(JSON.parse(c)),
                  );
                } catch {
                  // ignore stale candidates
                }
              }
            }
          }

          if (
            state.status === CallStatus.active &&
            phaseRef.current !== "active" &&
            pcRef.current
          ) {
            if (!isCalleeRef.current && state.sdpAnswer) {
              const remoteDesc = pcRef.current.remoteDescription;
              if (!remoteDesc) {
                await pcRef.current.setRemoteDescription(
                  new RTCSessionDescription({
                    type: "answer",
                    sdp: state.sdpAnswer,
                  }),
                );
              }
            }
            phaseRef.current = "active";
            setPhase("active");
            clearPolling();
            durationIntervalRef.current = setInterval(() => {
              setCallDuration((d) => d + 1);
            }, 1000);
          }

          if (
            [CallStatus.ended, CallStatus.declined, CallStatus.missed].includes(
              state.status,
            )
          ) {
            phaseRef.current = "ended";
            setPhase("ended");
            clearPolling();
            setTimeout(() => {
              cleanupResources();
              phaseRef.current = "idle";
              setPhase("idle");
            }, 2500);
          }
        } catch {
          // network error — keep polling
        }
      }, 2000);
    },
    [actor, clearPolling, cleanupResources],
  );

  const startCall = useCallback(
    async (calleeIdText: string, isVideo: boolean) => {
      if (!actor) return;
      const { Principal } = await import("@icp-sdk/core/principal");
      const calleeId = Principal.fromText(calleeIdText);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideo,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);

      const pc = buildPeerConnection(stream);
      pcRef.current = pc;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const id = await actor.createCall(calleeId, offer.sdp ?? "", isVideo);
      setCallId(id);
      isCalleeRef.current = false;

      pc.onicecandidate = async (e) => {
        if (e.candidate && actor) {
          await actor.addIceCandidate(
            id,
            JSON.stringify(e.candidate.toJSON()),
            false,
          );
        }
      };

      phaseRef.current = "outgoing";
      setPhase("outgoing");
      pollCallState(id);
    },
    [actor, buildPeerConnection, pollCallState],
  );

  const acceptCall = useCallback(
    async (incoming: CallStatePublic) => {
      if (!actor) return;
      isCalleeRef.current = true;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: incoming.isVideo,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);

      const pc = buildPeerConnection(stream);
      pcRef.current = pc;

      await pc.setRemoteDescription(
        new RTCSessionDescription({
          type: "offer",
          sdp: incoming.sdpOffer ?? "",
        }),
      );

      for (const c of incoming.callerCandidates) {
        appliedCandidatesRef.current.add(c);
        try {
          await pc.addIceCandidate(new RTCIceCandidate(JSON.parse(c)));
        } catch {
          // ignore
        }
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      pc.onicecandidate = async (e) => {
        if (e.candidate && actor) {
          await actor.addIceCandidate(
            incoming.id,
            JSON.stringify(e.candidate.toJSON()),
            true,
          );
        }
      };

      await actor.acceptCall(incoming.id, answer.sdp ?? "");
      setCallId(incoming.id);
      setCallState(incoming);
      phaseRef.current = "active";
      setPhase("active");

      durationIntervalRef.current = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);

      pollCallState(incoming.id);
    },
    [actor, buildPeerConnection, pollCallState],
  );

  const declineCall = useCallback(
    async (id: CallId) => {
      if (!actor) return;
      await actor.declineCall(id);
      phaseRef.current = "idle";
      setPhase("idle");
    },
    [actor],
  );

  const hangup = useCallback(async () => {
    if (actor && callId !== null) {
      await actor.hangupCall(callId).catch(() => {});
    }
    cleanupResources();
    phaseRef.current = "idle";
    setPhase("idle");
  }, [actor, callId, cleanupResources]);

  const toggleMute = useCallback(() => {
    if (!localStreamRef.current) return;
    for (const track of localStreamRef.current.getAudioTracks()) {
      track.enabled = !track.enabled;
    }
    setIsMuted((m) => !m);
  }, []);

  const toggleCamera = useCallback(() => {
    if (!localStreamRef.current) return;
    for (const track of localStreamRef.current.getVideoTracks()) {
      track.enabled = !track.enabled;
    }
    setIsCameraOff((v) => !v);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: cleanup on unmount only
  useEffect(() => {
    return () => {
      clearPolling();
      clearDurationTimer();
      if (pcRef.current) pcRef.current.close();
      if (localStreamRef.current) {
        for (const t of localStreamRef.current.getTracks()) t.stop();
      }
    };
  }, []);

  return {
    phase,
    callState,
    callId,
    localStream,
    remoteStream,
    isMuted,
    isCameraOff,
    callDuration,
    startCall,
    acceptCall,
    declineCall,
    hangup,
    toggleMute,
    toggleCamera,
  };
}
