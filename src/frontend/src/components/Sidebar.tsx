import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LogOut,
  MessageSquare,
  PlusCircle,
  Search,
  Settings,
  UserCircle2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useConversations } from "../hooks/useConversations";
import { useGroups } from "../hooks/useGroups";
import { useProfile } from "../hooks/useProfile";
import { Avatar } from "./Avatar";
import { ConversationListItem } from "./ConversationListItem";
import { SearchModal } from "./SearchModal";
import { UnreadBadge } from "./UnreadBadge";

const NAV_ITEMS = [
  { to: "/chats", icon: MessageSquare, label: "Chats" },
  { to: "/contacts", icon: Users, label: "Contacts" },
  { to: "/groups", icon: UserCircle2, label: "Groups" },
];

export function Sidebar() {
  const { logout } = useAuth();
  const { data: profile } = useProfile();
  const { data: conversations = [] } = useConversations();
  const { data: groups = [] } = useGroups();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  const totalUnread =
    conversations.reduce((acc, c) => acc + Number(c.unreadCount), 0) +
    groups.reduce((acc, g) => acc + Number(g.unreadCount), 0);

  const activeTab = location.pathname.startsWith("/chats")
    ? "/chats"
    : location.pathname.startsWith("/contacts")
      ? "/contacts"
      : location.pathname.startsWith("/groups")
        ? "/groups"
        : "";

  return (
    <aside
      data-ocid="sidebar"
      className="flex h-full w-[280px] flex-shrink-0 flex-col border-r border-border bg-card"
    >
      {/* App header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <MessageSquare className="size-4 text-primary" />
          </div>
          <span className="font-display font-semibold text-base text-foreground tracking-tight">
            Orbital
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchOpen(true)}
            aria-label="Search messages"
            data-ocid="open-search-btn"
          >
            <Search className="size-3.5" />
          </Button>
          {totalUnread > 0 && <UnreadBadge count={totalUnread} />}
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Nav icons */}
      <TooltipProvider>
        <nav className="flex gap-1 px-3 py-2 border-b border-border">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <Tooltip key={to}>
              <TooltipTrigger asChild>
                <Link
                  to={to}
                  data-ocid={`nav-${label.toLowerCase()}`}
                  className={cn(
                    "flex-1 flex items-center justify-center py-2 rounded-md text-muted-foreground transition-smooth hover:text-foreground hover:bg-accent/30",
                    activeTab === to &&
                      "text-primary bg-primary/10 hover:bg-primary/10 hover:text-primary",
                  )}
                >
                  <Icon className="size-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">{label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>

      {/* Content based on active tab */}
      <ScrollArea className="flex-1 min-h-0">
        {activeTab === "/chats" && (
          <div className="py-1">
            {conversations.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
                <MessageSquare className="size-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No conversations yet
                </p>
                <Link
                  to="/contacts"
                  className="text-xs text-primary hover:underline"
                >
                  Add a contact to start chatting
                </Link>
              </div>
            )}
            {conversations.map((conv) => (
              <ConversationListItem
                key={conv.conversationId.toString()}
                conversationId={conv.conversationId.toString()}
                name={conv.otherUsername}
                lastMessage={conv.lastMessage?.content}
                unreadCount={Number(conv.unreadCount)}
                href={`/chats/${conv.conversationId.toString()}`}
                active={
                  location.pathname ===
                  `/chats/${conv.conversationId.toString()}`
                }
              />
            ))}
          </div>
        )}

        {activeTab === "/contacts" && (
          <div className="py-1">
            <Link
              to="/contacts/add"
              data-ocid="add-contact-btn"
              className="flex items-center gap-2 mx-3 my-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-smooth"
            >
              <PlusCircle className="size-4 text-primary" />
              Add Contact
            </Link>
          </div>
        )}

        {activeTab === "/groups" && (
          <div className="py-1">
            <Link
              to="/groups/new"
              data-ocid="new-group-btn"
              className="flex items-center gap-2 mx-3 my-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-smooth"
            >
              <PlusCircle className="size-4 text-primary" />
              New Group
            </Link>
            {groups.map((g) => (
              <ConversationListItem
                key={g.group.id.toString()}
                conversationId={g.group.id.toString()}
                name={g.group.name}
                lastMessage={
                  g.group.description || `${Number(g.memberCount)} members`
                }
                unreadCount={Number(g.unreadCount)}
                href={`/groups/${g.group.id.toString()}`}
                active={
                  location.pathname === `/groups/${g.group.id.toString()}`
                }
                isGroup
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* User footer */}
      <div className="flex flex-col border-t border-border">
        <div className="flex items-center gap-2 p-3">
          <Link
            to="/profile"
            className="flex-1 flex items-center gap-2 min-w-0"
          >
            <Avatar
              name={profile?.username ?? "User"}
              src={profile?.avatar?.getDirectURL()}
              presence={profile?.presence}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate text-foreground">
                {profile?.username ?? "Set up profile"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.status || "Available"}
              </p>
            </div>
          </Link>
          <div className="flex gap-1">
            <Link to="/profile">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="Profile settings"
              >
                <Settings className="size-3.5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-destructive"
              onClick={logout}
              aria-label="Logout"
              data-ocid="logout-btn"
            >
              <LogOut className="size-3.5" />
            </Button>
          </div>
        </div>
        <div className="px-3 pb-2.5 text-center">
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            Built with caffeine.ai
          </a>
        </div>
      </div>
    </aside>
  );
}
