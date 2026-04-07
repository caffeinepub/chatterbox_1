import { type ReactNode, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";

const HEARTBEAT_INTERVAL = 30000;

function HeartbeatManager() {
  const { isAuthenticated } = useAuth();
  const { actor } = useBackend();

  useEffect(() => {
    if (!isAuthenticated || !actor) return;

    const tick = () => {
      actor.heartbeat().catch(() => {});
    };
    tick();
    const id = setInterval(tick, HEARTBEAT_INTERVAL);
    return () => clearInterval(id);
  }, [isAuthenticated, actor]);

  return null;
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <HeartbeatManager />
      {children}
    </div>
  );
}
