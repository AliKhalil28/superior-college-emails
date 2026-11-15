"use client";

import { Paperclip, RefreshCw, SearchX, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Email } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface EmailListProps {
  title: string;
  emails: Email[];
  selectedId: string | null;
  onSelect: (email: Email) => void;
  onToggleStar: (id: string) => void;
}

export function EmailList({ title, emails, selectedId, onSelect, onToggleStar }: EmailListProps) {
  return (
    <section className="flex w-full shrink-0 flex-col border-r bg-background sm:w-[340px] lg:w-[380px]">
      <div className="flex h-12 items-center justify-between border-b px-4">
        <h2 className="text-sm font-semibold capitalize">{title}</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{emails.length} messages</span>
          <button className="rounded-full p-1.5 transition hover:bg-muted" aria-label="Refresh">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <SearchX className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-medium">Nothing here</p>
            <p className="text-xs text-muted-foreground">
              No messages match in this folder right now.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {emails.map((email) => {
              const isSelected = email.id === selectedId;
              return (
                <li key={email.id}>
                  <button
                    onClick={() => onSelect(email)}
                    className={cn(
                      "relative flex w-full gap-3 px-4 py-3 text-left transition",
                      isSelected ? "bg-primary/10" : "hover:bg-muted/60",
                      email.unread && !isSelected && "bg-emerald-50/60 dark:bg-emerald-950/20"
                    )}
                  >
                    {email.unread && (
                      <span className="absolute left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
                    )}
                    <Avatar className="mt-0.5 h-9 w-9 shrink-0">
                      <AvatarFallback
                        className={cn("text-xs font-semibold text-white", email.from.color)}
                      >
                        {email.from.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span
                          className={cn(
                            "truncate text-sm",
                            email.unread ? "font-bold" : "font-medium"
                          )}
                        >
                          {email.from.name}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 text-[11px]",
                            email.unread ? "font-semibold text-primary" : "text-muted-foreground"
                          )}
                        >
                          {email.date === "Today" || email.date === "Yesterday"
                            ? email.time
                            : email.date}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block truncate text-[13px]",
                          email.unread ? "font-semibold" : "font-medium text-foreground/90"
                        )}
                      >
                        {email.subject}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {email.preview}
                      </span>
                      <span className="mt-1.5 flex items-center gap-2">
                        {email.hasAttachment && (
                          <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        {email.labels?.map((label) => (
                          <span
                            key={label}
                            className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                          >
                            {label}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={email.starred ? "Unstar" : "Star"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(email.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.stopPropagation();
                          onToggleStar(email.id);
                        }
                      }}
                      className="mt-1 shrink-0 self-start rounded-full p-0.5"
                    >
                      <Star
                        className={cn(
                          "h-4 w-4 transition",
                          email.starred
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/50 hover:text-amber-400"
                        )}
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>
    </section>
  );
}
