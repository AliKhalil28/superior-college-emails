"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bold,
  ChevronDown,
  ImagePlus,
  Italic,
  Link2,
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

export default function ComposePage() {
  const router = useRouter();
  const { prefill, setPrefill, addOutgoing } = useMail();

  const [from, setFrom] = useState(currentUser.addresses[0]);
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [attachments, setAttachments] = useState<{ name: string; size: string }[]>([]);
  const [confidential, setConfidential] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedFrom = window.localStorage.getItem("sm-default-from");
    if (savedFrom) setFrom(savedFrom);
    const savedSig = window.localStorage.getItem("sm-signature");
    if (prefill) {
      setTo(prefill.to ?? "");
      setSubject(prefill.subject ?? "");
      setBody((prefill.body ?? "") + (savedSig ?? ""));
      setPrefill(null);
    } else if (savedSig) {
      setBody(savedSig);
    }
    // Only consume the prefill/settings once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wrapSelection = (before: string, after: string) => {
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? body.length;
    const end = ta.selectionEnd ?? body.length;
    const selected = body.slice(start, end) || "text";
    const next = body.slice(0, start) + before + selected + after + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  const insertAtCursor = (text: string) => {
    const ta = bodyRef.current;
    if (!ta) {
      setBody((b) => b + text);
      return;
    }
    const start = ta.selectionStart ?? body.length;
    setBody(body.slice(0, start) + text + body.slice(start));
    requestAnimationFrame(() => ta.focus());
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const added = Array.from(files).map((f) => ({
      name: f.name,
      size:
        f.size > 1024 * 1024
          ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.max(1, Math.round(f.size / 1024))} KB`,
    }));
    setAttachments((prev) => [...prev, ...added]);
    toast.success(`${added.length} file${added.length > 1 ? "s" : ""} attached`);
  };

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
    attachments: attachments.length > 0 ? attachments : undefined,
    date: "Today",
    time: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  });

  const handleSend = () => {
    addOutgoing(buildEmail("sent"));
    toast.success("Message sent");
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
          <Select value={from} onValueChange={(v) => setFrom(v ?? currentUser.addresses[0])}>
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
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message…"
          className="min-h-0 flex-1 resize-none rounded-none border-0 p-4 text-sm leading-relaxed shadow-none focus-visible:ring-0"
        />

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-[#e8eaed] px-4 py-2.5">
            {attachments.map((att, i) => (
              <span
                key={`${att.name}-${i}`}
                className="flex items-center gap-2 rounded-md bg-[#f2f6fc] py-1 pl-2.5 pr-1.5 text-xs font-medium text-[#202124]"
              >
                <Paperclip className="h-3.5 w-3.5 text-[#5f6368]" />
                {att.name}
                <span className="font-normal text-[#5f6368]">({att.size})</span>
                <button
                  aria-label={`Remove ${att.name}`}
                  onClick={() =>
                    setAttachments((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-[#e8eaed]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
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
              className="flex items-center gap-2 bg-[#0b57d0] py-2 pl-5 pr-3 text-sm font-medium text-white transition hover:bg-[#0842a0]"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
            <button
              className="border-l border-white/25 bg-[#0b57d0] px-1.5 text-white transition hover:bg-[#0842a0]"
              aria-label="More send options"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
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
