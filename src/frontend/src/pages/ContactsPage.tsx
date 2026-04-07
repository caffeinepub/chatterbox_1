import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Check,
  MessageSquare,
  Search,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar } from "../components/Avatar";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { StatusBadge } from "../components/StatusBadge";
import { useBackend } from "../hooks/useBackend";
import {
  useAcceptContactRequest,
  useContacts,
  usePendingContactRequests,
  useRejectContactRequest,
  useRemoveContact,
} from "../hooks/useContacts";
import { type Contact, type ContactRequest, PresenceStatus } from "../types";

// ── Contact profile sheet ────────────────────────────────────────────────────
interface ContactSheetProps {
  contact: Contact | null;
  open: boolean;
  onClose: () => void;
}

function ContactSheet({ contact, open, onClose }: ContactSheetProps) {
  const { actor } = useBackend();
  const navigate = useNavigate();
  const remove = useRemoveContact();
  const [navigating, setNavigating] = useState(false);

  async function handleSendMessage() {
    if (!actor || !contact) return;
    setNavigating(true);
    try {
      const convId = await actor.getOrCreateDirectConversation(contact.userId);
      onClose();
      navigate({ to: "/chats/$id", params: { id: convId.toString() } });
    } finally {
      setNavigating(false);
    }
  }

  function handleRemove() {
    if (!contact) return;
    remove.mutate(contact.userId, {
      onSuccess: () => {
        toast.success("Contact removed");
        onClose();
      },
    });
  }

  if (!contact) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="bg-card border-border w-80">
        <SheetHeader>
          <SheetTitle className="font-display text-foreground">
            Contact Info
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center gap-4 mt-8">
          <Avatar
            name={contact.username}
            size="lg"
            presence={PresenceStatus.offline}
          />
          <div className="text-center">
            <p className="font-display font-semibold text-lg text-foreground">
              {contact.username}
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-mono break-all px-2">
              {contact.userId.toText()}
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full mt-2">
            <Button
              className="w-full"
              onClick={handleSendMessage}
              disabled={navigating}
              data-ocid="contact-sheet-send-message"
            >
              {navigating ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <MessageSquare className="size-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleRemove}
              disabled={remove.isPending}
              data-ocid="contact-sheet-remove"
            >
              <Trash2 className="size-4 mr-2" />
              Remove Contact
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Pending request row ──────────────────────────────────────────────────────
function PendingRow({ request }: { request: ContactRequest }) {
  const accept = useAcceptContactRequest();
  const reject = useRejectContactRequest();
  const fromText = request.from.toText();

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/40 transition-smooth"
      data-ocid="pending-request-row"
    >
      <Avatar name={fromText} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {fromText.slice(0, 10)}…{fromText.slice(-6)}
        </p>
        <p className="text-xs text-muted-foreground">Wants to connect</p>
      </div>
      <div className="flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="size-8 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
          onClick={() =>
            accept.mutate(request.id, {
              onSuccess: () => toast.success("Contact request accepted"),
            })
          }
          disabled={accept.isPending}
          aria-label="Accept request"
          data-ocid="accept-request-btn"
        >
          <Check className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-8 hover:bg-destructive/10 hover:text-destructive"
          onClick={() => reject.mutate(request.id)}
          disabled={reject.isPending}
          aria-label="Reject request"
          data-ocid="reject-request-btn"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export function ContactsPage() {
  const { data: contacts = [], isLoading } = useContacts();
  const { data: pendingRequests = [] } = usePendingContactRequests();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = contacts.filter((c) =>
    c.username.toLowerCase().includes(search.toLowerCase()),
  );

  function openContact(contact: Contact) {
    setSelected(contact);
    setSheetOpen(true);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <h1 className="font-display font-semibold text-lg text-foreground">
          Contacts
        </h1>
        <Link to="/contacts/add">
          <Button size="sm" data-ocid="add-contact-header-btn">
            <UserPlus className="size-4 mr-1.5" />
            Add Contact
          </Button>
        </Link>
      </header>

      {/* Search bar */}
      <div className="px-4 py-3 border-b border-border bg-card/60">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search contacts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            data-ocid="contacts-search"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Pending requests */}
            {pendingRequests.length > 0 && (
              <section className="border-b border-border bg-muted/20">
                <div className="px-4 pt-4 pb-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Incoming Requests ({pendingRequests.length})
                  </p>
                </div>
                <div className="px-2 pb-3">
                  {pendingRequests.map((req) => (
                    <PendingRow key={req.id.toString()} request={req} />
                  ))}
                </div>
              </section>
            )}

            {/* Contacts list */}
            <section className="p-2">
              {filtered.length === 0 ? (
                <EmptyState
                  icon={<Users className="size-7" />}
                  title={search ? "No matching contacts" : "No contacts yet"}
                  description={
                    search
                      ? "Try a different name or username."
                      : "Add people to start chatting with them."
                  }
                  action={
                    !search ? (
                      <Link to="/contacts/add">
                        <Button size="sm" data-ocid="contacts-empty-add">
                          Add your first contact
                        </Button>
                      </Link>
                    ) : undefined
                  }
                />
              ) : (
                <>
                  {!search && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 pt-2 pb-1">
                      All Contacts ({contacts.length})
                    </p>
                  )}
                  {search && (
                    <p className="text-xs text-muted-foreground px-3 pb-1">
                      {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    </p>
                  )}
                  {filtered.map((contact) => (
                    <button
                      key={contact.userId.toText()}
                      type="button"
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/60 transition-smooth text-left cursor-pointer group"
                      onClick={() => openContact(contact)}
                      data-ocid="contact-row"
                    >
                      <Avatar
                        name={contact.username}
                        size="md"
                        presence={PresenceStatus.offline}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {contact.username}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {contact.userId.toText().slice(0, 18)}…
                        </p>
                      </div>
                      <StatusBadge presence={PresenceStatus.offline} />
                    </button>
                  ))}
                </>
              )}
            </section>
          </>
        )}
      </div>

      <ContactSheet
        contact={selected}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
