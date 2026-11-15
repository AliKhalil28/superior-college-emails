"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type RailPanel = "calendar" | "keep" | "tasks" | "contacts" | null;

const titles: Record<Exclude<RailPanel, null>, string> = {
  calendar: "Calendar",
  keep: "Notes",
  tasks: "Tasks",
  contacts: "Contacts",
};

const directory = [
  { name: "Principal Office", email: "principal@superiorcollegemc.com", initials: "PO" },
  { name: "Admissions Office", email: "admissions@superiorcollegemc.com", initials: "AO" },
  { name: "IT Department", email: "it@superiorcollegemc.com", initials: "IT" },
  { name: "Accounts Office", email: "accounts@superiorcollegemc.com", initials: "AC" },
  { name: "Examination Cell", email: "exams@superiorcollegemc.com", initials: "EC" },
  { name: "HR Office", email: "hr@superiorcollegemc.com", initials: "HR" },
];

function CalendarPanel() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleString("en-US", { month: "long" });
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const events = [
    { day: today, title: "Staff meeting — Principal Office", time: "10:00 AM" },
    { day: Math.min(today + 2, daysInMonth), title: "Admissions desk duty roster", time: "9:00 AM" },
    { day: Math.min(today + 5, daysInMonth), title: "Monthly attendance report due", time: "4:00 PM" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">
        {monthName} {year}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="py-1 font-medium text-[#5f6368]">
            {d}
          </span>
        ))}
        {cells.map((day, i) => (
          <span
            key={i}
            className={cn(
              "flex h-8 items-center justify-center rounded-full",
              day === today
                ? "bg-[#0b57d0] font-medium text-white"
                : day
                  ? "text-[#202124] hover:bg-[#e8eaed]"
                  : ""
            )}
          >
            {day ?? ""}
          </span>
        ))}
      </div>
      <div className="space-y-2 border-t border-[#e8eaed] pt-3">
        <p className="text-xs font-medium uppercase tracking-wide text-[#5f6368]">Coming up</p>
        {events.map((ev) => (
          <div key={ev.title} className="rounded-lg bg-[#f2f6fc] px-3 py-2">
            <p className="text-sm font-medium text-[#202124]">{ev.title}</p>
            <p className="text-xs text-[#5f6368]">
              {monthName} {ev.day} · {ev.time}
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Design preview — the calendar connects with staff schedules in the functionality phase.
      </p>
    </div>
  );
}

function NotesPanel() {
  const [notes, setNotes] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("sm-notes");
      if (saved) setNotes(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: string[]) => {
    setNotes(next);
    window.localStorage.setItem("sm-notes", JSON.stringify(next));
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Take a note…"
          className="min-h-20"
        />
        <Button
          size="sm"
          className="w-full"
          disabled={!draft.trim()}
          onClick={() => {
            persist([draft.trim(), ...notes]);
            setDraft("");
          }}
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add note
        </Button>
      </div>
      {notes.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No notes yet. Notes you add stay saved on this device.
        </p>
      ) : (
        notes.map((note, i) => (
          <div key={i} className="group rounded-lg border border-[#e8eaed] bg-[#fff8e1] px-3 py-2">
            <p className="whitespace-pre-wrap text-sm text-[#202124]">{note}</p>
            <button
              className="mt-1 hidden items-center gap-1 text-xs text-[#5f6368] hover:text-red-600 group-hover:flex"
              onClick={() => persist(notes.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

type Task = { text: string; done: boolean };

function TasksPanel() {
  const [tasks, setTasks] = useState<Task[]>([
    { text: "Reply to admissions queries", done: false },
    { text: "Share lab timetable with faculty", done: true },
  ]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("sm-tasks");
      if (saved) setTasks(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: Task[]) => {
    setTasks(next);
    window.localStorage.setItem("sm-tasks", JSON.stringify(next));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a task…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && draft.trim()) {
              persist([{ text: draft.trim(), done: false }, ...tasks]);
              setDraft("");
            }
          }}
        />
        <Button
          size="icon"
          disabled={!draft.trim()}
          aria-label="Add task"
          onClick={() => {
            persist([{ text: draft.trim(), done: false }, ...tasks]);
            setDraft("");
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {tasks.map((task, i) => (
        <div key={i} className="flex items-center gap-2.5 rounded-lg px-1 py-1.5 hover:bg-[#f2f6fc]">
          <Checkbox
            checked={task.done}
            onCheckedChange={(v) =>
              persist(tasks.map((t, idx) => (idx === i ? { ...t, done: v === true } : t)))
            }
            aria-label={task.text}
          />
          <span className={cn("flex-1 text-sm", task.done && "text-[#5f6368] line-through")}>
            {task.text}
          </span>
          <button
            className="text-[#5f6368] hover:text-red-600"
            aria-label="Delete task"
            onClick={() => persist(tasks.filter((_, idx) => idx !== i))}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {tasks.length === 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">
          <Check className="mx-auto mb-1 h-5 w-5" /> All done. Add a task above.
        </p>
      )}
    </div>
  );
}

function ContactsPanel() {
  const [query, setQuery] = useState("");
  const list = useMemo(
    () =>
      directory.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );
  return (
    <div className="space-y-3">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the college directory…"
      />
      {list.map((c) => (
        <div key={c.email} className="flex items-center gap-3 rounded-lg px-1 py-1.5 hover:bg-[#f2f6fc]">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-[#0b3d2a] text-xs font-medium text-white">
              {c.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#202124]">{c.name}</p>
            <p className="truncate text-xs text-[#5f6368]">{c.email}</p>
          </div>
        </div>
      ))}
      {list.length === 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">No match in the directory.</p>
      )}
    </div>
  );
}

export function SidePanel({
  panel,
  onClose,
}: {
  panel: Exclude<RailPanel, null>;
  onClose: () => void;
}) {
  return (
    <aside className="absolute bottom-2 right-14 top-0 z-40 flex w-80 max-w-[85vw] flex-col rounded-2xl border border-[#e8eaed] bg-white shadow-xl md:static md:z-auto md:mb-2 md:ml-0 md:mr-2 md:shadow-sm">
      <div className="flex items-center justify-between border-b border-[#e8eaed] px-4 py-3">
        <h2 className="text-sm font-medium text-[#202124]">{titles[panel]}</h2>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#5f6368] hover:bg-[#e8eaed]"
          aria-label="Close panel"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {panel === "calendar" && <CalendarPanel />}
        {panel === "keep" && <NotesPanel />}
        {panel === "tasks" && <TasksPanel />}
        {panel === "contacts" && <ContactsPanel />}
      </div>
    </aside>
  );
}
