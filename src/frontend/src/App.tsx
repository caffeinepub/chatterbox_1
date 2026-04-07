import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { CallOverlay } from "./components/CallOverlay";
import { IncomingCallModal } from "./components/IncomingCallModal";
import { Layout } from "./components/Layout";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { OutgoingCallModal } from "./components/OutgoingCallModal";
import { Sidebar } from "./components/Sidebar";
import { CallContext } from "./contexts/CallContext";
import { useAuth } from "./hooks/useAuth";
import { useBackend } from "./hooks/useBackend";
import { useWebRTCCall } from "./hooks/useWebRTCCall";
import type { CallStatePublic } from "./types";

// ── Lazy page imports ────────────────────────────────────────────────────────

const ChatsPage = lazy(() =>
  import("./pages/ChatsPage").then((m) => ({ default: m.ChatsPage })),
);
const ChatThreadPage = lazy(() =>
  import("./pages/ChatThreadPage").then((m) => ({ default: m.ChatThreadPage })),
);
const ContactsPage = lazy(() =>
  import("./pages/ContactsPage").then((m) => ({ default: m.ContactsPage })),
);
const AddContactPage = lazy(() =>
  import("./pages/AddContactPage").then((m) => ({ default: m.AddContactPage })),
);
const GroupsPage = lazy(() =>
  import("./pages/GroupsPage").then((m) => ({ default: m.GroupsPage })),
);
const NewGroupPage = lazy(() =>
  import("./pages/NewGroupPage").then((m) => ({ default: m.NewGroupPage })),
);
const GroupChatPage = lazy(() =>
  import("./pages/GroupChatPage").then((m) => ({ default: m.GroupChatPage })),
);
const ProfilePage = lazy(() =>
  import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);

// ── Page loading fallback ────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <LoadingSpinner size="md" />
    </div>
  );
}

// ── Auth guard wrapper ───────────────────────────────────────────────────────
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Suspense fallback={<PageLoader />}>
          <LoginPage />
        </Suspense>
      </div>
    );
  }

  return <>{children}</>;
}

// ── Call manager — lives at the app shell level ──────────────────────────────
function CallManager({ children }: { children: React.ReactNode }) {
  const { actor, isFetching } = useBackend();
  const webrtc = useWebRTCCall();
  const [pendingIncoming, setPendingIncoming] =
    useState<CallStatePublic | null>(null);
  const [outgoingPeerName, setOutgoingPeerName] = useState("");
  const [callerName, setCallerName] = useState("Unknown");
  const [isAccepting, setIsAccepting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll for incoming calls every 3s
  // biome-ignore lint/correctness/useExhaustiveDependencies: poll for incoming calls
  useEffect(() => {
    if (!actor || isFetching) return;
    pollRef.current = setInterval(async () => {
      if (webrtc.phase !== "idle") return;
      try {
        const pending = await actor.getPendingCall();
        if (pending) {
          setPendingIncoming(pending);
          // Try to get caller name
          try {
            const profile = await actor.getUserProfile(pending.callerId);
            if (profile) setCallerName(profile.username);
          } catch {
            setCallerName("Unknown");
          }
        } else {
          setPendingIncoming(null);
        }
      } catch {
        // ignore
      }
    }, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [actor, isFetching]);

  const handleStartCall = (
    calleeIdText: string,
    peerName: string,
    isVideo: boolean,
  ) => {
    setOutgoingPeerName(peerName);
    webrtc.startCall(calleeIdText, isVideo);
  };

  const handleAccept = async () => {
    if (!pendingIncoming) return;
    setIsAccepting(true);
    try {
      await webrtc.acceptCall(pendingIncoming);
      setPendingIncoming(null);
    } catch {
      setIsAccepting(false);
    }
  };

  const handleDecline = async () => {
    if (!pendingIncoming) return;
    await webrtc.declineCall(pendingIncoming.id);
    setPendingIncoming(null);
  };

  return (
    <CallContext.Provider value={{ startCall: handleStartCall }}>
      {children}

      {/* Incoming call modal — shown when idle and a pending call arrives */}
      {webrtc.phase === "idle" && pendingIncoming && (
        <IncomingCallModal
          callState={pendingIncoming}
          callerName={callerName}
          onAccept={handleAccept}
          onDecline={handleDecline}
          isAccepting={isAccepting}
        />
      )}

      {/* Outgoing call modal */}
      {webrtc.phase === "outgoing" && (
        <OutgoingCallModal
          calleeName={outgoingPeerName}
          isVideo={webrtc.callState?.isVideo ?? false}
          onCancel={() => webrtc.hangup()}
        />
      )}

      {/* Active call overlay */}
      {(webrtc.phase === "active" || webrtc.phase === "ended") && (
        <CallOverlay
          peerName={
            webrtc.phase === "active"
              ? outgoingPeerName || callerName
              : "Call ended"
          }
          isVideo={webrtc.callState?.isVideo ?? false}
          localStream={webrtc.localStream}
          remoteStream={webrtc.remoteStream}
          isMuted={webrtc.isMuted}
          isCameraOff={webrtc.isCameraOff}
          callDuration={webrtc.callDuration}
          onToggleMute={webrtc.toggleMute}
          onToggleCamera={webrtc.toggleCamera}
          onHangup={() => webrtc.hangup()}
        />
      )}
    </CallContext.Provider>
  );
}

// ── App shell with sidebar ───────────────────────────────────────────────────
function AppShell() {
  return (
    <AuthGuard>
      <CallManager>
        <Layout>
          <Sidebar />
          <main className="flex-1 min-w-0 flex flex-col bg-background overflow-hidden">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </main>
        </Layout>
      </CallManager>
    </AuthGuard>
  );
}

// ── Route definitions ────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: AppShell });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/chats" />,
});

const chatsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chats",
  component: ChatsPage,
});

const chatThreadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chats/$id",
  component: ChatThreadPageWrapper,
});

const contactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contacts",
  component: ContactsPage,
});

const addContactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contacts/add",
  component: AddContactPage,
});

const groupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/groups",
  component: GroupsPage,
});

const newGroupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/groups/new",
  component: NewGroupPage,
});

const groupChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/groups/$id",
  component: GroupChatPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  chatsRoute,
  chatThreadRoute,
  contactsRoute,
  addContactRoute,
  groupsRoute,
  newGroupRoute,
  groupChatRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ── Wrapper for ChatThreadPage to inject call context ────────────────────────
import { useCallContext } from "./contexts/CallContext";

function ChatThreadPageWrapper() {
  const { startCall } = useCallContext();
  return (
    <Suspense fallback={<PageLoader />}>
      <ChatThreadPage onStartCall={startCall} />
    </Suspense>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}
