"use client";

import { useMemo, useState } from "react";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComposeDialog, type ComposeInitial } from "@/components/mail/compose-dialog";
import { EmailList } from "@/components/mail/email-list";
import { EmailView } from "@/components/mail/email-view";
import { Sidebar } from "@/components/mail/sidebar";
import { Topbar } from "@/components/mail/topbar";
import { emails as seedEmails, folders, type Email, type FolderId } from "@/lib/mock-data";

export function MailApp() {
  const [allEmails, setAllEmails] = useState<Email[]>(seedEmails);
  const [folder, setFolder] = useState<FolderId>("inbox");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeInitial, setComposeInitial] = useState<ComposeInitial>({});

  const visibleEmails = useMemo(() => {
    let list =
      folder === "starred"
        ? allEmails.filter((e) => e.starred)
        : allEmails.filter((e) => e.folder === folder);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.from.name.toLowerCase().includes(q) ||
          e.from.email.toLowerCase().includes(q) ||
          e.preview.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allEmails, folder, query]);

  const selectedEmail = allEmails.find((e) => e.id === selectedId) ?? null;

  const handleSelectFolder = (next: FolderId) => {
    setFolder(next);
    setSelectedId(null);
  };

  const handleSelectEmail = (email: Email) => {
    setSelectedId(email.id);
    if (email.unread) {
      setAllEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, unread: false } : e))
      );
    }
  };

  const handleToggleStar = (id: string) => {
    setAllEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e))
    );
  };

  const openCompose = (initial: ComposeInitial = {}) => {
    setComposeInitial(initial);
    setComposeOpen(true);
  };

  const handleReply = (email: Email, mode: "reply" | "forward") => {
    if (mode === "reply") {
      openCompose({
        to: email.from.email,
        subject: email.subject.startsWith("Re:") ? email.subject : `Re: ${email.subject}`,
        body: `\n\n----- Original message -----\nFrom: ${email.from.name} <${email.from.email}>\n${email.body.join("\n")}`,
      });
    } else {
      openCompose({
        subject: email.subject.startsWith("Fwd:") ? email.subject : `Fwd: ${email.subject}`,
        body: `\n\n----- Forwarded message -----\nFrom: ${email.from.name} <${email.from.email}>\nSubject: ${email.subject}\n\n${email.body.join("\n")}`,
      });
    }
  };

  const folderLabel = folders.find((f) => f.id === folder)?.label ?? folder;

  return (
    <div className="flex h-screen flex-col bg-background">
      <Topbar query={query} onQueryChange={setQuery} />
      <div className="flex min-h-0 flex-1">
        <Sidebar active={folder} onSelect={handleSelectFolder} onCompose={() => openCompose()} />
        <EmailList
          title={folderLabel}
          emails={visibleEmails}
          selectedId={selectedId}
          onSelect={handleSelectEmail}
          onToggleStar={handleToggleStar}
        />
        <div className="hidden min-w-0 flex-1 lg:flex">
          <EmailView email={selectedEmail} onReply={handleReply} />
        </div>
      </div>

      {/* Mobile reading view: shown under the list on small screens */}
      {selectedEmail && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-background lg:hidden">
          <div className="sticky top-0 flex h-12 items-center border-b bg-background px-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
              ← Back to list
            </Button>
          </div>
          <EmailView email={selectedEmail} onReply={handleReply} />
        </div>
      )}

      <Button
        onClick={() => openCompose()}
        className="fixed bottom-5 right-5 z-30 h-12 w-12 rounded-full bg-[#c9a227] p-0 text-[#231a00] shadow-lg hover:bg-[#b8921f] md:hidden"
        aria-label="Compose"
      >
        <SquarePen className="h-5 w-5" />
      </Button>

      <ComposeDialog
        open={composeOpen}
        onOpenChange={setComposeOpen}
        initial={composeInitial}
      />
    </div>
  );
}
