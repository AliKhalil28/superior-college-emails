"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (prefill) {
      setTo(prefill.to ?? "");
      setSubject(prefill.subject ?? "");
      setBody(prefill.body ?? "");
      setPrefill(null);
    }
    // Only consume the prefill once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <button className={ghostIcon} aria-label="Undo">
            <Undo2 className="h-4 w-4" />
          </button>
          <button className={ghostIcon} aria-label="Redo">
            <Redo2 className="h-4 w-4" />
          </button>
          <span className="mx-1 h-5 w-px bg-[#dadce0]" />
          <button className={ghostIcon} aria-label="Bold">
            <Bold className="h-4 w-4" />
          </button>
          <button className={ghostIcon} aria-label="Italic">
            <Italic className="h-4 w-4" />
          </button>
          <button className={ghostIcon} aria-label="Underline">
            <Underline className="h-4 w-4" />
          </button>
          <span className="mx-1 h-5 w-px bg-[#dadce0]" />
          <button className={ghostIcon} aria-label="Insert link">
            <Link2 className="h-4 w-4" />
          </button>
          <button className={ghostIcon} aria-label="Insert emoji">
            <Smile className="h-4 w-4" />
          </button>
          <button className={ghostIcon} aria-label="Insert photo">
            <ImagePlus className="h-4 w-4" />
          </button>
        </div>

        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message…"
          className="min-h-0 flex-1 resize-none rounded-none border-0 p-4 text-sm leading-relaxed shadow-none focus-visible:ring-0"
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

          <button className={ghostIcon} aria-label="Attach files">
            <Paperclip className="h-5 w-5" />
          </button>
          <button className={ghostIcon} aria-label="Insert link">
            <Link2 className="h-5 w-5" />
          </button>
          <button className={ghostIcon} aria-label="Insert emoji">
            <Smile className="h-5 w-5" />
          </button>
          <button className={ghostIcon} aria-label="Confidential mode">
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
