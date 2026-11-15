"use client";

import { Archive, Clock, MailOpen, Paperclip, SearchX, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import type { Email } from "@/lib/mock-data";
import { useMail } from "@/components/mail/mail-context";
import { cn } from "@/lib/utils";

interface EmailListProps {
  emails: Email[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string, checked: boolean) => void;
  onSelect: (email: Email) => void;
}

export function EmailList({ emails, selectedIds, onToggleSelect, onSelect }: EmailListProps) {
  const { toggleStar, moveToFolder, markUnread } = useMail();

  if (emails.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-20 text-center">
        <SearchX className="h-10 w-10 text-[#5f6368]/50" />
        <p className="text-sm font-medium text-[#202124]">No messages found</p>
        <p className="text-[13px] text-[#5f6368]">
          There are no messages matching your search or this folder is empty.
        </p>
      </div>
    );
  }

  const rowAction = (
    e: React.MouseEvent,
    action: () => void,
    message: string
  ) => {
    e.stopPropagation();
    action();
    toast.success(message);
  };

  return (
    <ul className="divide-y divide-[#e8eaed]">
      {emails.map((email) => {
        const checked = selectedIds.has(email.id);
        return (
          <li key={email.id}>
            <div
              onClick={() => onSelect(email)}
              className={cn(
                "group relative flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm transition sm:gap-3 sm:px-4",
                email.unread ? "bg-white" : "bg-[#f2f6fc]",
                "hover:z-10 hover:shadow-[inset_0_-1px_0_#dadce0,0_1px_3px_rgba(60,64,67,0.3)]"
              )}
            >
              <span onClick={(e) => e.stopPropagation()} className="flex items-center">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => onToggleSelect(email.id, v === true)}
                  aria-label="Select message"
                  className="border-[#5f6368]"
                />
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(email.id);
                }}
                aria-label={email.starred ? "Unstar" : "Star"}
                className="shrink-0 rounded-full p-0.5"
              >
                <Star
                  className={cn(
                    "h-[18px] w-[18px] transition",
                    email.starred
                      ? "fill-amber-400 text-amber-400"
                      : "text-[#5f6368]/60 hover:text-amber-400"
                  )}
                />
              </button>

              <span
                className={cn(
                  "w-32 shrink-0 truncate sm:w-44",
                  email.unread ? "font-bold text-[#202124]" : "text-[#202124]"
                )}
              >
                {email.from.name}
              </span>

              <span className="min-w-0 flex-1 truncate">
                <span className={cn(email.unread ? "font-bold text-[#202124]" : "text-[#202124]")}>
                  {email.subject}
                </span>
                <span className="text-[#5f6368]"> — {email.preview}</span>
              </span>

              {email.hasAttachment && (
                <Paperclip className="h-4 w-4 shrink-0 text-[#5f6368]" />
              )}

              <span
                className={cn(
                  "w-14 shrink-0 text-right text-xs group-hover:hidden",
                  email.unread ? "font-bold text-[#202124]" : "text-[#5f6368]"
                )}
              >
                {email.date === "Today" || email.date === "Yesterday" ? email.time : email.date}
              </span>

              <span className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
                <button
                  className="rounded-full p-1.5 text-[#5f6368] hover:bg-[#e8eaed]"
                  aria-label="Archive"
                  onClick={(e) =>
                    rowAction(e, () => moveToFolder(email.id, "archive"), "Conversation archived")
                  }
                >
                  <Archive className="h-4 w-4" />
                </button>
                <button
                  className="rounded-full p-1.5 text-[#5f6368] hover:bg-[#e8eaed]"
                  aria-label="Delete"
                  onClick={(e) =>
                    rowAction(e, () => moveToFolder(email.id, "trash"), "Conversation moved to Trash")
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  className="rounded-full p-1.5 text-[#5f6368] hover:bg-[#e8eaed]"
                  aria-label="Mark as unread"
                  onClick={(e) =>
                    rowAction(e, () => markUnread(email.id), "Marked as unread")
                  }
                >
                  <MailOpen className="h-4 w-4" />
                </button>
                <button
                  className="rounded-full p-1.5 text-[#5f6368] hover:bg-[#e8eaed]"
                  aria-label="Snooze"
                  onClick={(e) =>
                    rowAction(e, () => {}, "Snoozed until tomorrow, 8:00 AM")
                  }
                >
                  <Clock className="h-4 w-4" />
                </button>
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
