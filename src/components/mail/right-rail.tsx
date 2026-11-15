"use client";

import { CalendarDays, CircleCheckBig, Lightbulb, Plus, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RailPanel } from "@/components/mail/side-panel";

const railItems: { id: Exclude<RailPanel, null>; label: string; icon: typeof CalendarDays }[] = [
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "keep", label: "Notes", icon: Lightbulb },
  { id: "tasks", label: "Tasks", icon: CircleCheckBig },
  { id: "contacts", label: "Contacts", icon: UsersRound },
];

export function RightRail({
  active,
  onSelect,
}: {
  active: RailPanel;
  onSelect: (panel: RailPanel) => void;
}) {
  return (
    <div className="hidden w-14 shrink-0 flex-col items-center gap-1 py-2 md:flex">
      {railItems.map((item) => (
        <button
          key={item.id}
          title={item.label}
          aria-label={item.label}
          onClick={() => onSelect(active === item.id ? null : item.id)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full transition",
            active === item.id
              ? "bg-[#d3e3fd] text-[#041e49]"
              : "text-[#5f6368] hover:bg-[#e8eaed]"
          )}
        >
          <item.icon className="h-5 w-5" />
        </button>
      ))}
      <div className="my-2 h-px w-6 bg-[#dadce0]" />
      <button
        title="Add a task"
        aria-label="Add a task"
        onClick={() => onSelect("tasks")}
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#5f6368] transition hover:bg-[#e8eaed]"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}
