"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Inbox,
  RefreshCw,
  Tag,
  UsersRound,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailList } from "@/components/mail/email-list";
import { EmailView } from "@/components/mail/email-view";
import { useMail } from "@/components/mail/mail-context";
import { folders, type Email } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Category = "primary" | "promotions" | "social";

const tabs: { id: Category; label: string; icon: typeof Inbox }[] = [
  { id: "primary", label: "Primary", icon: Inbox },
  { id: "promotions", label: "Promotions", icon: Tag },
  { id: "social", label: "Social", icon: UsersRound },
];

export default function MailPage() {
  const { emails, folder, query, markRead } = useMail();
  const [category, setCategory] = useState<Category>("primary");
  const [openedId, setOpenedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const folderEmails = useMemo(() => {
    let list =
      folder === "starred"
        ? emails.filter((e) => e.starred)
        : emails.filter((e) => e.folder === folder);
    if (folder === "inbox") {
      list = list.filter((e) => (e.category ?? "primary") === category);
    }
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
  }, [emails, folder, category, query]);

  const openedEmail = emails.find((e) => e.id === openedId) ?? null;
  const folderLabel = folders.find((f) => f.id === folder)?.label ?? "Inbox";

  const handleOpen = (email: Email) => {
    setOpenedId(email.id);
    markRead(email.id);
  };

  const handleToggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const allChecked =
    folderEmails.length > 0 && folderEmails.every((e) => selectedIds.has(e.id));

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(folderEmails.map((e) => e.id)) : new Set());
  };

  if (openedEmail) {
    return <EmailView email={openedEmail} onBack={() => setOpenedId(null)} />;
  }

  const iconBtn =
    "flex h-9 w-9 items-center justify-center rounded-full text-[#5f6368] transition hover:bg-[#e8eaed]";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* List toolbar */}
      <div className="flex h-12 items-center gap-1 px-3 sm:px-4">
        <span className="flex items-center">
          <Checkbox
            checked={allChecked}
            onCheckedChange={(v) => handleSelectAll(v === true)}
            aria-label="Select all"
            className="border-[#5f6368]"
          />
          <ChevronDown className="ml-0.5 h-4 w-4 text-[#5f6368]" />
        </span>
        <button className={iconBtn} aria-label="Refresh">
          <RefreshCw className="h-[18px] w-[18px]" />
        </button>
        <button className={iconBtn} aria-label="More">
          <EllipsisVertical className="h-[18px] w-[18px]" />
        </button>
        {selectedIds.size > 0 && (
          <span className="ml-2 text-sm text-[#0b57d0]">{selectedIds.size} selected</span>
        )}
        <div className="ml-auto flex items-center gap-1 text-xs text-[#5f6368]">
          <span className="mr-1">
            {folderEmails.length === 0
              ? "0"
              : `1–${folderEmails.length} of ${folderEmails.length}`}
          </span>
          <button className={iconBtn} aria-label="Newer" disabled>
            <ChevronLeft className="h-5 w-5 opacity-50" />
          </button>
          <button className={iconBtn} aria-label="Older" disabled>
            <ChevronRight className="h-5 w-5 opacity-50" />
          </button>
        </div>
      </div>

      {/* Category tabs (Inbox only) */}
      {folder === "inbox" ? (
        <div className="flex border-b border-[#e8eaed] px-2 sm:px-4">
          {tabs.map((tab) => {
            const isActive = category === tab.id;
            const count =
              tab.id === "primary"
                ? emails.filter(
                    (e) =>
                      e.folder === "inbox" && (e.category ?? "primary") === "primary" && e.unread
                  ).length
                : 0;
            return (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={cn(
                  "relative flex flex-1 items-center gap-3 px-3 py-3 text-sm transition sm:max-w-64 sm:flex-none sm:pr-16",
                  isActive ? "font-medium text-[#0b57d0]" : "text-[#5f6368] hover:bg-[#f2f6fc]"
                )}
              >
                <tab.icon className="h-[18px] w-[18px]" />
                <span className="truncate">{tab.label}</span>
                {count > 0 && (
                  <span className="rounded-full bg-[#0b57d0] px-1.5 py-px text-[11px] font-medium text-white">
                    {count} new
                  </span>
                )}
                {isActive && (
                  <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-[#0b57d0]" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="border-b border-[#e8eaed] px-4 py-2.5">
          <h2 className="text-sm font-medium text-[#202124]">{folderLabel}</h2>
        </div>
      )}

      <ScrollArea className="flex-1">
        <EmailList
          emails={folderEmails}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelect={handleOpen}
        />
      </ScrollArea>

      <div className="flex items-center justify-between border-t border-[#e8eaed] px-4 py-1.5 text-xs text-[#5f6368]">
        <span>0.18 GB of 10 GB used</span>
        <span className="hidden sm:block">Superior Mail · Hostinger mailbox</span>
        <span>Last account activity: just now</span>
      </div>
    </div>
  );
}
