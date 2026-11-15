"use client";

import {
  Archive,
  Download,
  Forward,
  MailOpen,
  Paperclip,
  Printer,
  Reply,
  ReplyAll,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Email } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface EmailViewProps {
  email: Email | null;
  onReply: (email: Email, mode: "reply" | "forward") => void;
}

export function EmailView({ email, onReply }: EmailViewProps) {
  if (!email) {
    return (
      <section className="hidden flex-1 flex-col items-center justify-center gap-3 bg-muted/20 p-8 text-center lg:flex">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <MailOpen className="h-8 w-8 text-primary" />
        </div>
        <p className="font-medium">No message selected</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Choose a message from the list to read it here.
        </p>
      </section>
    );
  }

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-background">
      <div className="flex h-12 items-center gap-1 border-b px-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Archive">
          <Archive className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Delete">
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Print">
          <Printer className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <Button
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={() => onReply(email, "reply")}
        >
          <Reply className="mr-1.5 h-4 w-4" /> Reply
        </Button>
        <Button variant="ghost" size="sm" className="hidden h-8 sm:flex" onClick={() => onReply(email, "reply")}>
          <ReplyAll className="mr-1.5 h-4 w-4" /> Reply all
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={() => onReply(email, "forward")}
        >
          <Forward className="mr-1.5 h-4 w-4" /> Forward
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-5 py-5 sm:px-7">
          <h1 className="text-xl font-semibold leading-snug">{email.subject}</h1>
          {email.labels && email.labels.length > 0 && (
            <div className="mt-2 flex gap-1.5">
              {email.labels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={cn("text-sm font-semibold text-white", email.from.color)}>
                {email.from.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <span className="font-semibold">{email.from.name}</span>{" "}
                <span className="text-muted-foreground">&lt;{email.from.email}&gt;</span>
              </p>
              <p className="text-xs text-muted-foreground">
                to {email.to} · {email.date}, {email.time}
              </p>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="space-y-4 text-[15px] leading-relaxed text-foreground/90">
            {email.body.map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>

          {email.attachments && email.attachments.length > 0 && (
            <>
              <Separator className="my-6" />
              <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Paperclip className="h-4 w-4" />
                {email.attachments.length} attachment{email.attachments.length > 1 ? "s" : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                {email.attachments.map((att) => (
                  <button
                    key={att.name}
                    className="group flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition hover:border-primary/50 hover:bg-primary/5"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-red-50 text-[10px] font-bold text-red-600 dark:bg-red-950/40">
                      FILE
                    </span>
                    <span>
                      <span className="block max-w-[220px] truncate text-sm font-medium">
                        {att.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">{att.size}</span>
                    </span>
                    <Download className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="mt-8 flex gap-2 pb-4">
            <Button variant="outline" onClick={() => onReply(email, "reply")}>
              <Reply className="mr-2 h-4 w-4" /> Reply
            </Button>
            <Button variant="outline" onClick={() => onReply(email, "forward")}>
              <Forward className="mr-2 h-4 w-4" /> Forward
            </Button>
          </div>
        </div>
      </ScrollArea>
    </section>
  );
}
