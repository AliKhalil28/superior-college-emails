"use client";

import { useEffect, useState } from "react";
import { Paperclip, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { currentUser } from "@/lib/mock-data";

export interface ComposeInitial {
  to?: string;
  subject?: string;
  body?: string;
}

interface ComposeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: ComposeInitial;
}

export function ComposeDialog({ open, onOpenChange, initial }: ComposeDialogProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showCc, setShowCc] = useState(false);

  useEffect(() => {
    if (open) {
      setTo(initial.to ?? "");
      setSubject(initial.subject ?? "");
      setBody(initial.body ?? "");
      setShowCc(false);
    }
  }, [open, initial]);

  const handleSend = () => {
    toast.info("Design preview", {
      description:
        "Sending will activate in the functionality phase, when the portal connects to the Hostinger mailbox over SMTP.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-2xl">
        <DialogHeader className="border-b bg-[#0b3d2a] px-5 py-3.5">
          <DialogTitle className="text-base text-white">New message</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          <div className="flex items-center gap-3">
            <Label className="w-14 shrink-0 text-muted-foreground">From</Label>
            <Select defaultValue={currentUser.addresses[0]}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentUser.addresses.map((addr) => (
                  <SelectItem key={addr} value={addr}>
                    {addr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Label htmlFor="compose-to" className="w-14 shrink-0 text-muted-foreground">
              To
            </Label>
            <Input
              id="compose-to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="name@superiorcollegemc.com"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => setShowCc((v) => !v)}
              className="shrink-0 text-xs font-medium text-primary hover:underline"
            >
              Cc / Bcc
            </button>
          </div>

          {showCc && (
            <>
              <div className="flex items-center gap-3">
                <Label htmlFor="compose-cc" className="w-14 shrink-0 text-muted-foreground">
                  Cc
                </Label>
                <Input id="compose-cc" placeholder="Cc recipients" />
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="compose-bcc" className="w-14 shrink-0 text-muted-foreground">
                  Bcc
                </Label>
                <Input id="compose-bcc" placeholder="Bcc recipients" />
              </div>
            </>
          )}

          <div className="flex items-center gap-3">
            <Label htmlFor="compose-subject" className="w-14 shrink-0 text-muted-foreground">
              Subject
            </Label>
            <Input
              id="compose-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
            />
          </div>

          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message…"
            className="min-h-[220px] resize-none border-0 bg-muted/30 focus-visible:ring-1"
          />
        </div>

        <DialogFooter className="flex-row items-center justify-between border-t px-5 py-3 sm:justify-between">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Attach file">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Discard draft"
              onClick={() => onOpenChange(false)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Save draft
            </Button>
            <Button onClick={handleSend} className="bg-[#c9a227] font-semibold text-[#231a00] hover:bg-[#b8921f]">
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
