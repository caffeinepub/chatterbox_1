import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Search, UserCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar } from "../components/Avatar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { useContacts, useSendContactRequest } from "../hooks/useContacts";
import { useFindUserByUsername } from "../hooks/useProfile";
import type { ProfilePublic } from "../types";

export function AddContactPage() {
  const navigate = useNavigate();
  const { principal } = useAuth();
  const { data: contacts = [] } = useContacts();
  const findUser = useFindUserByUsername();
  const sendRequest = useSendContactRequest();

  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ProfilePublic | null | undefined>(
    undefined,
  );
  const [sent, setSent] = useState(false);

  const isAlreadyContact =
    result != null
      ? contacts.some((c) => c.userId.toText() === result.userId.toText())
      : false;

  const isSelf =
    result != null ? principal?.toText() === result.userId.toText() : false;

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    setSent(false);
    setResult(undefined);
    const user = await findUser.mutateAsync(query.trim());
    setResult(user);
  }

  function handleAdd() {
    if (!result) return;
    sendRequest.mutate(result.userId, {
      onSuccess: () => {
        toast.success(`Request sent to ${result.username}`);
        setSent(true);
      },
      onError: () =>
        toast.error("Failed to send request. A request may already exist."),
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border bg-card">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => navigate({ to: "/contacts" })}
          aria-label="Go back"
          data-ocid="add-contact-back"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="font-display font-semibold text-lg text-foreground">
          Add Contact
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-6 py-8">
          <form onSubmit={handleSearch} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username-search" className="text-sm font-medium">
                Find by username
              </Label>
              <div className="flex gap-2">
                <Input
                  id="username-search"
                  data-ocid="username-search-input"
                  placeholder="Enter exact username…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setResult(undefined);
                    setSent(false);
                  }}
                  className="flex-1 bg-secondary/30"
                  autoFocus
                />
                <Button
                  type="submit"
                  disabled={findUser.isPending || !query.trim()}
                  data-ocid="search-user-btn"
                >
                  {findUser.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Search className="size-4 mr-1.5" />
                      Find
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Username must be exact — share your username from your profile
                so others can find you.
              </p>
            </div>
          </form>

          {/* Results */}
          <div className="mt-6">
            {findUser.isPending && (
              <div className="flex justify-center py-10">
                <LoadingSpinner />
              </div>
            )}

            {findUser.isSuccess && result === null && (
              <div className="rounded-xl border border-border bg-muted/30 px-5 py-6 text-center">
                <p className="text-sm font-medium text-foreground">
                  No user found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Make sure the username is spelled exactly right.
                </p>
              </div>
            )}

            {result != null && (
              <div
                className="rounded-xl border border-border bg-card px-5 py-4 flex items-center gap-4"
                data-ocid="search-result"
              >
                <Avatar
                  name={result.username}
                  size="md"
                  presence={result.presence}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {result.username}
                  </p>
                  {result.status && (
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {result.status}
                    </p>
                  )}
                  <StatusBadge
                    presence={result.presence}
                    showLabel
                    className="mt-1"
                  />
                </div>
                <div className="flex-shrink-0">
                  {isSelf ? (
                    <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted">
                      That's you
                    </span>
                  ) : isAlreadyContact ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 px-2 py-1 rounded-md bg-emerald-500/10">
                      <UserCheck className="size-3.5" />
                      Connected
                    </span>
                  ) : sent ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-primary px-2 py-1 rounded-md bg-primary/10">
                      <UserCheck className="size-3.5" />
                      Sent
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleAdd}
                      disabled={sendRequest.isPending}
                      data-ocid="send-request-btn"
                    >
                      {sendRequest.isPending ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <UserPlus className="size-3.5 mr-1.5" />
                          Add
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
