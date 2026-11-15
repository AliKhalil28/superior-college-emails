"use client";

import { CalendarDays, CircleCheck, NotebookPen, Plus, UsersRound } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const items = [
  { icon: CalendarDays, label: "Calendar", color: "text-[#0b57d0]" },
  { icon: NotebookPen, label: "Notes", color: "text-amber-500" },
  { icon: CircleCheck, label: "Tasks", color: "text-[#0b57d0]" },
  { icon: UsersRound, label: "Contacts", color: "text-emerald-600" },
];

export function RightRail() {
  return (
    <div className="hidden w-14 shrink-0 flex-col items-center gap-2 bg-[#f6f8fc] py-3 xl:flex">
      {items.map((item) => (
        <button
          key={item.label}
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#e8eaed]"
          aria-label={item.label}
          title={item.label}
        >
          <item.icon className={`h-5 w-5 ${item.color}`} />
        </button>
      ))}
      <Separator className="my-1 w-6 bg-[#e0e4ea]" />
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#5f6368] transition hover:bg-[#e8eaed]"
        aria-label="Get add-ons"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}
