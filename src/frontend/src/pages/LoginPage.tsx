import { Button } from "@/components/ui/button";
import { MessageSquare, Shield, Users } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Direct Messages",
    description: "Private one-on-one encrypted conversations",
  },
  {
    icon: Users,
    title: "Group Chats",
    description: "Create groups and chat with multiple people",
  },
  {
    icon: Shield,
    title: "Secure & Decentralized",
    description: "Powered by the Internet Computer",
  },
];

export function LoginPage() {
  const { login, isInitializing } = useAuth();

  if (isInitializing) {
    return null;
  }

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-8 px-6">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="size-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
          <MessageSquare className="size-8 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="font-display font-bold text-3xl text-foreground tracking-tight">
            Orbital
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Decentralized messaging for everyone
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="w-full flex flex-col gap-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border"
          >
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Login CTA */}
      <div className="w-full flex flex-col items-center gap-3">
        <Button
          size="lg"
          className="w-full"
          onClick={login}
          data-ocid="login-btn"
        >
          Sign in with Internet Identity
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Internet Identity provides secure, privacy-preserving authentication.
          No passwords or personal data required.
        </p>
      </div>
    </div>
  );
}
