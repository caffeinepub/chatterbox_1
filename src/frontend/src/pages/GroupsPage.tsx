import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@tanstack/react-router";
import { MessageSquare, PlusCircle, Users } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { UnreadBadge } from "../components/UnreadBadge";
import { useGroups } from "../hooks/useGroups";

export function GroupsPage() {
  const { data: groups = [], isLoading } = useGroups();

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div>
          <h1 className="font-display font-semibold text-lg text-foreground">
            Groups
          </h1>
          {groups.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {groups.length} group{groups.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Link to="/groups/new">
          <Button size="sm" data-ocid="create-group-header-btn">
            <PlusCircle className="size-4 mr-1.5" />
            New Group
          </Button>
        </Link>
      </header>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
          </div>
        ) : groups.length === 0 ? (
          <EmptyState
            icon={<Users className="size-7" />}
            title="No groups yet"
            description="Create a group to start chatting with multiple people at once."
            action={
              <Link to="/groups/new">
                <Button size="sm" data-ocid="create-first-group-cta">
                  Create your first group
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="py-3 px-3 flex flex-col gap-1">
            {groups.map((g) => (
              <Link
                key={g.group.id.toString()}
                to="/groups/$id"
                params={{ id: g.group.id.toString() }}
                data-ocid="group-list-item"
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary/60 transition-smooth group"
              >
                {/* Group icon */}
                <div className="relative flex-shrink-0">
                  <div className="size-12 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center overflow-hidden">
                    {g.group.icon ? (
                      <img
                        src={g.group.icon.getDirectURL()}
                        alt={g.group.name}
                        className="size-12 object-cover"
                      />
                    ) : (
                      <Users className="size-5 text-primary/70" />
                    )}
                  </div>
                  {Number(g.unreadCount) > 0 && (
                    <span className="absolute -top-1 -right-1">
                      <UnreadBadge count={Number(g.unreadCount)} />
                    </span>
                  )}
                </div>

                {/* Group info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {g.group.name}
                    </p>
                    <span className="text-[10px] text-muted-foreground/60 flex-shrink-0 flex items-center gap-1">
                      <Users className="size-3" />
                      {Number(g.memberCount)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-1">
                    {g.group.description ? (
                      <span className="truncate">{g.group.description}</span>
                    ) : (
                      <>
                        <MessageSquare className="size-3 flex-shrink-0" />
                        <span className="truncate">
                          {g.lastMessage ? "View messages" : "No messages yet"}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
