"use client";

import {
  Archive,
  FileText,
  Inbox,
  OctagonAlert,
  Send,
  SquarePen,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { folders, labels, type FolderId } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const folderIcons: Record<FolderId, typeof Inbox> = {
  inbox: Inbox,
  starred: Star,
  sent: Send,
  drafts: FileText,
  archive: Archive,
  spam: OctagonAlert,
  trash: Trash2,
};

interface SidebarProps {
  active: FolderId;
  onSelect: (folder: FolderId) => void;
  onCompose: () => void;
}

export function Sidebar({ active, onSelect, onCompose }: SidebarProps) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-background p-3 md:flex">
      <Button
        onClick={onCompose}
        className="mb-4 h-11 w-full bg-[#c9a227] font-semibold text-[#231a00] shadow hover:bg-[#b8921f]"
      >
        <SquarePen className="mr-2 h-4 w-4" />
        Compose
      </Button>

      <nav className="space-y-0.5">
        {folders.map((folder) => {
          const Icon = folderIcons[folder.id];
          const isActive = active === folder.id;
          return (
            <button
              key={folder.id}
              onClick={() => onSelect(folder.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                isActive
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-foreground/80 hover:bg-muted"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "fill-primary/20")} />
              <span className="flex-1 text-left">{folder.label}</span>
              {folder.unread ? (
                <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5 text-[11px]">
                  {folder.unread}
                </Badge>
              ) : folder.count ? (
                <span className="text-xs text-muted-foreground">{folder.count}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <Separator className="my-4" />

      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Labels
      </p>
      <div className="space-y-0.5">
        {labels.map((label) => (
          <button
            key={label.name}
            className="flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-sm text-foreground/80 transition hover:bg-muted"
          >
            <Tag className={cn("h-3.5 w-3.5", label.color.replace("bg-", "text-"))} />
            {label.name}
          </button>
        ))}
      </div>

      <div className="mt-auto space-y-3 pt-4">
        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="text-xs font-medium">Mailbox storage</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[18%] rounded-full bg-primary" />
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">1.8 GB of 10 GB used</p>
        </div>
        <div className="rounded-lg border border-[#c9a227]/40 bg-[#c9a227]/5 p-3">
          <p className="text-xs font-medium">Hostinger plan</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            30 mailboxes on superiorcollegemc.com — 9 created so far.
          </p>
        </div>
      </div>
    </aside>
  );
}
