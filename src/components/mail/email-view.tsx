"use client";

import { useRouter } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  EllipsisVertical,
  Forward,
  Mail,
  OctagonAlert,
  Paperclip,
  Printer,
  Reply,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Email } from "@/lib/mock-data";
import { useMail } from "@/components/mail/mail-context";
import { cn } from "@/lib/utils";

interface EmailViewProps {
  email: Email;
  onBack: () => void;
}

export function EmailView({ email, onBack }: EmailViewProps) {
  const router = useRouter();
  const { setPrefill, moveToFolder, toggleStar } = useMail();

  const goCompose = (mode: "reply" | "forward") => {
    if (mode === "reply") {
      setPrefill({
        to: email.from.email,
        subject: email.subject.startsWith("Re:") ? email.subject : `Re: ${email.subject}`,
        body: `\n\n----- Original message -----\nFrom: ${email.from.name} <${email.from.email}>\nSubject: ${email.subject}\n\n${email.body.join("\n")}`,
      });
    } else {
      setPrefill({
        subject: email.subject.startsWith("Fwd:") ? email.subject : `Fwd: ${email.subject}`,
        body: `\n\n----- Forwarded message -----\nFrom: ${email.from.name} <${email.from.email}>\nSubject: ${email.subject}\n\n${email.body.join("\n")}`,
      });
    }
    router.push("/mail/compose");
  };

  const toolbarBtn =
    "flex h-9 w-9 items-center justify-center rounded-full text-[#5f6368] transition hover:bg-[#e8eaed]";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-12 items-center gap-1 px-2 sm:px-3">
        <button className={toolbarBtn} aria-label="Back to list" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="mx-1 h-5 w-px bg-[#e8eaed]" />
        <button
          className={toolbarBtn}
          aria-label="Archive"
          onClick={() => {
            moveToFolder(email.id, "archive");
            toast.success("Conversation archived");
            onBack();
          }}
        >
          <Archive className="h-[18px] w-[18px]" />
        </button>
        <button className={toolbarBtn} aria-label="Report spam">
          <OctagonAlert className="h-[18px] w-[18px]" />
        </button>
        <button
          className={toolbarBtn}
          aria-label="Delete"
          onClick={() => {
            moveToFolder(email.id, "trash");
            toast.success("Conversation moved to Trash");
            onBack();
          }}
        >
          <Trash2 className="h-[18px] w-[18px]" />
        </button>
        <span className="mx-1 h-5 w-px bg-[#e8eaed]" />
        <button className={toolbarBtn} aria-label="Mark as unread">
          <Mail className="h-[18px] w-[18px]" />
        </button>
        <button className={toolbarBtn} aria-label="Snooze">
          <Clock className="h-[18px] w-[18px]" />
        </button>
        <div className="ml-auto flex items-center gap-1 text-xs text-[#5f6368]">
          <span className="mr-1 hidden sm:block">1 of 24</span>
          <button className={toolbarBtn} aria-label="Newer">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className={toolbarBtn} aria-label="Older">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 pb-8 pt-1 sm:px-6">
          <div className="flex flex-wrap items-center gap-3 pl-0 sm:pl-12">
            <h1 className="text-[22px] font-normal leading-snug text-[#202124]">
              {email.subject}
            </h1>
            <span className="flex items-center gap-1 rounded bg-[#e8eaed] px-1.5 py-0.5 text-[11px] text-[#5f6368]">
              Inbox
              <button aria-label="Remove label" onClick={onBack} className="hover:text-black">
                ×
              </button>
            </span>
          </div>

          <div className="mt-5 flex items-start gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className={cn("text-sm font-medium text-white", email.from.color)}>
                {email.from.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm">
                  <span className="font-bold text-[#202124]">{email.from.name}</span>{" "}
                  <span className="text-xs text-[#5f6368]">&lt;{email.from.email}&gt;</span>
                </p>
                <div className="flex items-center gap-0.5 text-xs text-[#5f6368]">
                  <span className="mr-1">
                    {email.date}, {email.time}
                  </span>
                  <button
                    className={toolbarBtn}
                    aria-label="Star"
                    onClick={() => toggleStar(email.id)}
                  >
                    <Star
                      className={cn(
                        "h-[18px] w-[18px]",
                        email.starred ? "fill-amber-400 text-amber-400" : ""
                      )}
                    />
                  </button>
                  <button
                    className={toolbarBtn}
                    aria-label="Reply"
                    onClick={() => goCompose("reply")}
                  >
                    <Reply className="h-[18px] w-[18px]" />
                  </button>
                  <button className={toolbarBtn} aria-label="More">
                    <EllipsisVertical className="h-[18px] w-[18px]" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#5f6368]">to me ▾</p>

              <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#202124]">
                {email.body.map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>

              {email.attachments && email.attachments.length > 0 && (
                <div className="mt-7">
                  <p className="mb-2.5 flex items-center gap-2 text-sm font-medium text-[#202124]">
                    <Paperclip className="h-4 w-4" /> {email.attachments.length} Attachment
                    {email.attachments.length > 1 ? "s" : ""}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {email.attachments.map((att) => (
                      <button
                        key={att.name}
                        className="group w-44 overflow-hidden rounded-lg border border-[#dadce0] text-left transition hover:shadow-md"
                      >
                        <span className="flex h-24 items-center justify-center bg-[#f8f9fa] text-xs font-bold tracking-wide text-[#5f6368]">
                          {att.name.split(".").pop()?.toUpperCase()} PREVIEW
                        </span>
                        <span className="flex items-center gap-2 border-t border-[#dadce0] px-2.5 py-2">
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-medium text-[#202124]">
                              {att.name}
                            </span>
                            <span className="block text-[11px] text-[#5f6368]">{att.size}</span>
                          </span>
                          <Download className="h-4 w-4 shrink-0 text-[#5f6368] group-hover:text-[#0b57d0]" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-9 flex gap-2.5">
                <button
                  onClick={() => goCompose("reply")}
                  className="flex items-center gap-2 rounded-full border border-[#747775] px-5 py-2 text-sm font-medium text-[#0b57d0] transition hover:bg-[#0b57d0]/5"
                >
                  <Reply className="h-4 w-4" /> Reply
                </button>
                <button
                  onClick={() => goCompose("forward")}
                  className="flex items-center gap-2 rounded-full border border-[#747775] px-5 py-2 text-sm font-medium text-[#0b57d0] transition hover:bg-[#0b57d0]/5"
                >
                  <Forward className="h-4 w-4" /> Forward
                </button>
                <button className="ml-auto hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-[#5f6368] transition hover:bg-[#e8eaed] sm:flex">
                  <Printer className="h-4 w-4" /> Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
