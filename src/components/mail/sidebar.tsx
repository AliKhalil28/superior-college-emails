"use client";

import { useRouter } from "next/navigation";
import {
  Archive,
  FileText,
  Inbox,
  OctagonAlert,
  Plus,
  Send,
  SquarePen,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { folders, labels, type FolderId } from "@/lib/mock-data";
import { useMail } from "@/components/mail/mail-context";
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

export function Sidebar({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const { folder, setFolder, labelFilter, setLabelFilter } = useMail();

  const goFolder = (next: FolderId) => {
    setFolder(next);
    setLabelFilter(null);
    router.push("/mail");
    onNavigate?.();
  };

  const goLabel = (label: string) => {
    setLabelFilter(labelFilter === label ? null : label);
    router.push("/mail");
    onNavigate?.();
  };

  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 flex-col bg-[#f6f8fc] py-2 pl-2 pr-4 md:flex",
        className
      )}
    >
      <div className="mb-4 pl-2 pt-1">
        <button
          onClick={() => {
            router.push("/mail/compose");
            onNavigate?.();
          }}
          className="flex h-14 items-center gap-3 rounded-2xl bg-[#c2e7ff] px-6 text-sm font-medium text-[#001d35] shadow-sm transition hover:shadow-md"
        >
          <SquarePen className="h-5 w-5" />
          Compose
        </button>
      </div>

      <nav className="space-y-px">
        {folders.map((item) => {
          const Icon = folderIcons[item.id];
          const isActive = folder === item.id;
          return (
            <button
              key={item.id}
              onClick={() => goFolder(item.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-r-full py-1.5 pl-4 pr-3 text-sm transition",
                isActive
                  ? "bg-[#d3e3fd] font-medium text-[#041e49]"
                  : "text-[#202124] hover:bg-[#e8eaed]"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px]",
                  item.id === "starred" && isActive && "fill-[#041e49]"
                )}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.unread ? (
                <span className="text-xs font-bold">{item.unread}</span>
              ) : item.count ? (
                <span className="text-xs text-[#5f6368]">{item.count}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <Separator className="my-3 bg-[#e0e4ea]" />

      <div className="mb-1 flex items-center justify-between pl-4 pr-1">
        <p className="text-sm font-medium text-[#202124]">Labels</p>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#5f6368] transition hover:bg-[#e8eaed]"
          aria-label="Create label"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-px">
        {labels.map((label) => {
          const isActive = labelFilter === label.name;
          return (
            <button
              key={label.name}
              onClick={() => goLabel(label.name)}
              className={cn(
                "flex w-full items-center gap-4 rounded-r-full py-1.5 pl-4 pr-3 text-sm transition",
                isActive
                  ? "bg-[#d3e3fd] font-medium text-[#041e49]"
                  : "text-[#202124] hover:bg-[#e8eaed]"
              )}
            >
              <Tag className={cn("h-[18px] w-[18px]", label.color.replace("bg-", "text-"))} />
              {label.name}
              {isActive && <span className="ml-auto text-xs">✓</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-auto px-4 pb-2 pt-4">
        <div className="h-1 overflow-hidden rounded-full bg-[#e0e4ea]">
          <div className="h-full w-[18%] rounded-full bg-[#5f6368]" />
        </div>
        <p className="mt-2 text-xs text-[#5f6368]">1.8 GB of 10 GB used</p>
        <p className="mt-2 text-xs leading-relaxed text-[#5f6368]">
          Hostinger plan · 30 mailboxes
          <br />
          superiorcollegemc.com
        </p>
      </div>
    </aside>
  );
}
