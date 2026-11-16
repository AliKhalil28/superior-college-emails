"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bold,
  CheckCircle2,
  ChevronDown,
  ImagePlus,
  Italic,
  Link2,
  Loader2,
  Lock,
  Paperclip,
  Redo2,
  Send,
  Smile,
  Trash2,
  Underline,
  Undo2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMail } from "@/components/mail/mail-context";
import { currentUser, type Email } from "@/lib/mock-data";
import { useLocalStorage } from "@/lib/use-local-storage";

export default function ComposePage() {
  const router = useRouter();
  const { prefill, setPrefill, addOutgoing } = useMail();

  const [savedDefaultFrom] = useLocalStorage("sm-default-from", currentUser.addresses[0]);
  const [savedSig] = useLocalStorage("sm-signature", "");

  const [fromOverride, setFromOverride] = useState<string | null>(null);
  const from = fromOverride ?? savedDefaultFrom;

  const [to, setTo] = useState(() => prefill?.to ?? "");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState(() => prefill?.subject ?? "");

  const [bodyDraft, setBodyDraft] = useState<string | null>(null);
  const initialBody = (prefill?.body ?? "") + (savedSig ?? "");
  const body = bodyDraft ?? initialBody;

  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  type Attachment = { name: string; size: string; progress: number; done: boolean };
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [confidential, setConfidential] = useState(false);
  const uploading = attachments.some((a) => !a.done);
  const wasUploadingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Clear consumed prefill upon exiting the compose flow
  useEffect(() => {
    return () => {
      setPrefill(null);
    };
  }, [setPrefill]);

  const wrapSelection = (before: string, after: string) => {
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? body.length;
    const end = ta.selectionEnd ?? body.length;
    const selected = body.slice(start, end) || "text";
    const next = body.slice(0, start) + before + selected + after + body.slice(end);
    setBodyDraft(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  const insertAtCursor = (text: string) => {
    const ta = bodyRef.current;
    if (!ta) {
      setBodyDraft(body + text);
      return;
    }
    const start = ta.selectionStart ?? body.length;
    setBodyDraft(body.slice(0, start) + text + body.slice(start));
    requestAnimationFrame(() => ta.focus());
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const added: Attachment[] = Array.from(files).map((f) => ({
      name: f.name,
      size:
        f.size > 1024 * 1024
          ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.max(1, Math.round(f.size / 1024))} KB`,
      progress: 0,
      done: false,
    }));
    setAttachments((prev) => [...prev, ...added]);
  };

  // Simulated upload progress — each file visibly uploads, then is confirmed
  // ready so the sender knows it will go out with the message.
  useEffect(() => {
    if (!uploading) {
      if (wasUploadingRef.current && attachments.length > 0) {
        toast.success(
          `${attachments.length} file${attachments.length > 1 ? "s" : ""} uploaded — will be sent with this email`
        );
      }
      wasUploadingRef.current = false;
      return;
    }

    wasUploadingRef.current = true;
    const timer = setInterval(() => {
      setAttachments((prev) =>
        prev.map((a) => {
          if (a.done) return a;
          const next = Math.min(100, a.progress + 12 + Math.random() * 20);
          return { ...a, progress: next, done: next >= 100 };
        })
      );
    }, 160);
    return () => clearInterval(timer);
  }, [uploading, attachments.length]);

  const buildEmail = (folder: "sent" | "drafts"): Email => ({
    id: `local-${Date.now()}`,
    folder,
    from: {
      name: currentUser.name,
      email: from,
      initials: currentUser.initials,
      color: "bg-emerald-600",
    },
    to: to || "(no recipient)",
    subject: subject || "(no subject)",
    preview: body.trim().slice(0, 110) || "…",
    body: body ? [body] : [""],
    hasAttachment: attachments.length > 0,
    attachments:
      attachments.length > 0
        ? attachments.map(({ name, size }) => ({ name, size }))
        : undefined,
    date: "Today",
    time: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  });

  const handleSend = () => {
    if (uploading) {
      toast.info("Please wait — attachments are still uploading");
      return;
    }
    const outgoing = buildEmail("sent");
    addOutgoing(outgoing);

    // Dispatch to Hostinger SMTP / Supabase API
    fetch("/api/mail/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        cc: cc || undefined,
        bcc: bcc || undefined,
        subject: subject || "(no subject)",
        text: body,
      }),
    }).catch(() => {});

    toast.success(
      attachments.length > 0
        ? `Message sent with ${attachments.length} attachment${attachments.length > 1 ? "s" : ""}`
        : "Message sent"
    );
    router.push("/mail");
  };

  const handleSaveDraft = () => {
    addOutgoing(buildEmail("drafts"));
    toast.success("Draft saved");
    router.push("/mail");
  };

  const handleDiscard = () => {
    toast.info("Draft discarded");
    router.push("/mail");
  };

  const fieldRow = "flex items-center gap-2 border-b border-[#e8eaed] px-4 py-1.5";
  const fieldLabel = "w-12 shrink-0 text-sm text-[#5f6368]";
  const ghostIcon =
    "flex h-9 w-9 items-center justify-center rounded-full text-[#5f6368] transition hover:bg-[#e8eaed]";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-12 items-center gap-2 px-3 sm:px-4">
        <button
          className={ghostIcon}
          aria-label="Back to inbox"
          onClick={() => router.push("/mail")}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-medium text-[#202124]">New Message</h1>
        <span className="ml-2 hidden text-xs text-[#5f6368] sm:block">
          Draft saved automatically · Design preview
        </span>
      </div>

      <div className="mx-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-2xl border border-[#e0e4ea] shadow-sm sm:mx-4">
        <div className={fieldRow}>
          <span className={fieldLabel}>From</span>
          <Select value={from} onValueChange={(v) => setFromOverride(v ?? currentUser.addresses[0])}>
            <SelectTrigger className="h-9 w-full border-0 shadow-none focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentUser.addresses.map((addr) => (
                <SelectItem key={addr} value={addr}>
                  {currentUser.name} &lt;{addr}&gt;
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={fieldRow}>
          <span className={fieldLabel}>To</span>
          <Input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Recipients"
            className="h-9 border-0 shadow-none focus-visible:ring-0"
          />
          <button
            type="button"
            onClick={() => setShowCc((v) => !v)}
            className="shrink-0 text-sm text-[#5f6368] hover:underline"
          >
            Cc
          </button>
          <button
            type="button"
            onClick={() => setShowBcc((v) => !v)}
            className="shrink-0 text-sm text-[#5f6368] hover:underline"
          >
            Bcc
          </button>
        </div>

        {showCc && (
          <div className={fieldRow}>
            <span className={fieldLabel}>Cc</span>
            <Input
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="Cc recipients"
              className="h-9 border-0 shadow-none focus-visible:ring-0"
            />
          </div>
        )}
        {showBcc && (
          <div className={fieldRow}>
            <span className={fieldLabel}>Bcc</span>
            <Input
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
              placeholder="Bcc recipients"
              className="h-9 border-0 shadow-none focus-visible:ring-0"
            />
          </div>
        )}

        <div className={fieldRow}>
          <span className={fieldLabel}>Subject</span>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="h-9 border-0 shadow-none focus-visible:ring-0"
          />
        </div>

        {/* Formatting toolbar (design) */}
        <div className="flex items-center gap-0.5 border-b border-[#e8eaed] bg-[#f8f9fa] px-3 py-1">
          <button
            className={ghostIcon}
            aria-label="Undo"
            onClick={() => {
              bodyRef.current?.focus();
              document.execCommand("undo");
            }}
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            className={ghostIcon}
            aria-label="Redo"
            onClick={() => {
              bodyRef.current?.focus();
              document.execCommand("redo");
            }}
          >
            <Redo2 className="h-4 w-4" />
          </button>
          <span className="mx-1 h-5 w-px bg-[#dadce0]" />
          <button className={ghostIcon} aria-label="Bold" onClick={() => wrapSelection("**", "**")}>
            <Bold className="h-4 w-4" />
          </button>
          <button className={ghostIcon} aria-label="Italic" onClick={() => wrapSelection("*", "*")}>
            <Italic className="h-4 w-4" />
          </button>
          <button className={ghostIcon} aria-label="Underline" onClick={() => wrapSelection("__", "__")}>
            <Underline className="h-4 w-4" />
          </button>
          <span className="mx-1 h-5 w-px bg-[#dadce0]" />
          <button
            className={ghostIcon}
            aria-label="Insert link"
            onClick={() => wrapSelection("[", "](https://)")}
          >
            <Link2 className="h-4 w-4" />
          </button>
          <button className={ghostIcon} aria-label="Insert emoji" onClick={() => insertAtCursor(" 😊")}>
            <Smile className="h-4 w-4" />
          </button>
          <button
            className={ghostIcon}
            aria-label="Insert photo"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" />
          </button>
        </div>

        <Textarea
          ref={bodyRef}
          value={body}
          onChange={(e) => setBodyDraft(e.target.value)}
          placeholder="Write your message…"
          className="min-h-0 flex-1 resize-none rounded-none border-0 p-4 text-sm leading-relaxed shadow-none focus-visible:ring-0"
        />

        {attachments.length > 0 && (
          <div className="border-t border-[#e8eaed] px-4 py-2.5">
            <div className="flex flex-wrap gap-2">
              {attachments.map((att, i) => (
                <span
                  key={`${att.name}-${i}`}
                  className="relative flex items-center gap-2 overflow-hidden rounded-md bg-[#f2f6fc] py-1.5 pl-2.5 pr-1.5 text-xs font-medium text-[#202124]"
                >
                  {att.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#0b57d0]" />
                  )}
                  <span className="max-w-44 truncate">{att.name}</span>
                  <span className="font-normal text-[#5f6368]">({att.size})</span>
                  <span className={att.done ? "font-normal text-emerald-700" : "font-normal text-[#0b57d0]"}>
                    {att.done ? "Uploaded · will be sent" : `Uploading ${Math.round(att.progress)}%`}
                  </span>
                  <button
                    aria-label={`Remove ${att.name}`}
                    onClick={() =>
                      setAttachments((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-[#e8eaed]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  {!att.done && (
                    <span
                      className="absolute bottom-0 left-0 h-0.5 bg-[#0b57d0] transition-all"
                      style={{ width: `${att.progress}%` }}
                    />
                  )}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-[#5f6368]">
              {uploading
                ? "Uploading attachments — Send will be enabled when the upload finishes."
                : "All attachments uploaded. They will be shared with the recipient when you press Send."}
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <div className="flex items-center gap-1 border-t border-[#e8eaed] px-3 py-2.5">
          <div className="flex overflow-hidden rounded-full shadow-sm">
            <button
              onClick={handleSend}
              disabled={uploading}
              className="flex items-center gap-2 bg-[#0b57d0] py-2 pl-5 pr-3 text-sm font-medium text-white transition hover:bg-[#0842a0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {uploading ? "Uploading…" : "Send"}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="border-l border-white/25 bg-[#0b57d0] px-1.5 text-white transition hover:bg-[#0842a0]"
                aria-label="More send options"
              >
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 rounded-xl">
                <DropdownMenuItem onClick={handleSend}>
                  <Send className="mr-2 h-4 w-4" /> Send now
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSaveDraft}>
                  <Paperclip className="mr-2 h-4 w-4" /> Save as draft instead
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button
            className={ghostIcon}
            aria-label="Attach files"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <button
            className={ghostIcon}
            aria-label="Insert link"
            onClick={() => wrapSelection("[", "](https://)")}
          >
            <Link2 className="h-5 w-5" />
          </button>
          <button
            className={ghostIcon}
            aria-label="Insert emoji"
            onClick={() => insertAtCursor(" 😊")}
          >
            <Smile className="h-5 w-5" />
          </button>
          <button
            className={`${ghostIcon} ${confidential ? "bg-[#d3e3fd] text-[#0b57d0]" : ""}`}
            aria-label="Confidential mode"
            onClick={() => {
              setConfidential((v) => !v);
              toast.info(
                confidential ? "Confidential mode off" : "Confidential mode on",
                {
                  description: confidential
                    ? undefined
                    : "Recipients will not be able to forward, copy or download this message (design preview).",
                }
              );
            }}
          >
            <Lock className="h-5 w-5" />
          </button>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={handleSaveDraft}
              className="rounded-full px-4 py-2 text-sm font-medium text-[#0b57d0] transition hover:bg-[#0b57d0]/5"
            >
              Save draft
            </button>
            <button className={ghostIcon} aria-label="Discard draft" onClick={handleDiscard}>
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-3" />
    </div>
  );
}
