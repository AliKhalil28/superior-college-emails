"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CircleHelp,
  FlaskConical,
  Globe,
  Grip,
  Keyboard,
  LogOut,
  Menu,
  Search,
  Settings,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currentUser } from "@/lib/mock-data";
import { useMail } from "@/components/mail/mail-context";

const collegeApps = [
  { name: "College Website", url: "https://www.superiorcollegemc.com", icon: Globe },
  { name: "Superior Lab Tracker", url: "https://labs.superiorcollegemc.com", icon: FlaskConical },
  { name: "Digital E-Library", url: "https://elibrary.superiorcollegemc.com", icon: BookOpen },
];

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const { query, setQuery, setAttachmentOnly } = useMail();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [fromField, setFromField] = useState("");
  const [subjectField, setSubjectField] = useState("");
  const [hasAtt, setHasAtt] = useState(false);

  const applySearchOptions = () => {
    const term = fromField.trim() || subjectField.trim();
    setQuery(term);
    setAttachmentOnly(hasAtt);
    setOptionsOpen(false);
    router.push("/mail");
    toast.success("Search filters applied");
  };

  const clearSearchOptions = () => {
    setFromField("");
    setSubjectField("");
    setHasAtt(false);
    setQuery("");
    setAttachmentOnly(false);
    setOptionsOpen(false);
  };

  const iconBtn =
    "hidden h-10 w-10 items-center justify-center rounded-full text-[#5f6368] transition hover:bg-[#e8eaed] sm:flex";

  return (
    <header className="flex h-16 items-center gap-2 bg-[#f6f8fc] px-4 sm:gap-4">
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#5f6368] transition hover:bg-[#e8eaed]"
          aria-label="Main menu"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5 pr-2">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5">
            <Image src="/logo.png" alt="Superior College crest" width={34} height={34} />
          </div>
          <p className="hidden text-[22px] font-normal leading-none text-[#5f6368] md:block">
            Superior <span className="font-medium text-[#0b3d2a]">Mail</span>
          </p>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-2xl flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5f6368]" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search mail"
          className="h-12 rounded-full border-0 bg-[#eaeef3] pl-12 pr-12 text-[15px] shadow-none placeholder:text-[#5f6368] focus-visible:bg-white focus-visible:ring-0 focus-visible:shadow-md"
        />
        <DropdownMenu open={optionsOpen} onOpenChange={setOptionsOpen}>
          <DropdownMenuTrigger
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#5f6368] transition hover:bg-[#dadce0]"
            aria-label="Show search options"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl p-4">
            <p className="mb-3 text-sm font-medium text-[#202124]">Search options</p>
            <div className="space-y-3">
              <div className="grid gap-1.5">
                <Label htmlFor="search-from">From</Label>
                <Input
                  id="search-from"
                  value={fromField}
                  onChange={(e) => setFromField(e.target.value)}
                  placeholder="Sender name or address"
                  className="h-9"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="search-subject">Subject</Label>
                <Input
                  id="search-subject"
                  value={subjectField}
                  onChange={(e) => setSubjectField(e.target.value)}
                  placeholder="Words in the subject"
                  className="h-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="search-att"
                  checked={hasAtt}
                  onCheckedChange={(v) => setHasAtt(v === true)}
                />
                <Label htmlFor="search-att" className="font-normal">
                  Has attachment
                </Label>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" className="flex-1" onClick={applySearchOptions}>
                  Search
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={clearSearchOptions}>
                  Clear
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger className={iconBtn} aria-label="Help">
            <CircleHelp className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-1.5">
            <DropdownMenuLabel>Help</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                toast.info("IT Department", {
                  description:
                    "For mailbox help, contact it@superiorcollegemc.com or visit the IT Office.",
                })
              }
            >
              <CircleHelp className="mr-2 h-4 w-4" /> Help & support
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toast.info("Keyboard shortcuts", {
                  description: "Shortcuts arrive with the functionality phase.",
                })
              }
            >
              <Keyboard className="mr-2 h-4 w-4" /> Keyboard shortcuts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                toast.info("Superior Mail", {
                  description:
                    "Official email portal of Superior College Mian Channu — UI design phase.",
                })
              }
            >
              About Superior Mail
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          className={iconBtn}
          aria-label="Settings"
          onClick={() => router.push("/mail/settings")}
        >
          <Settings className="h-5 w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="hidden h-10 w-10 items-center justify-center rounded-full text-[#5f6368] transition hover:bg-[#e8eaed] md:flex"
            aria-label="College apps"
          >
            <Grip className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 rounded-2xl p-2">
            <DropdownMenuLabel>Superior College apps</DropdownMenuLabel>
            <div className="grid grid-cols-3 gap-1 p-1">
              {collegeApps.map((app) => (
                <a
                  key={app.name}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-center transition hover:bg-[#f2f6fc]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0b3d2a]/10">
                    <app.icon className="h-5 w-5 text-[#0b3d2a]" />
                  </span>
                  <span className="text-xs leading-tight text-[#202124]">{app.name}</span>
                </a>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-[#0b3d2a] text-sm font-medium text-white">
                {currentUser.initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 rounded-2xl p-2">
            <DropdownMenuLabel className="px-3 py-2">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{currentUser.role}</p>
              <p className="mt-0.5 truncate text-xs font-normal text-muted-foreground">
                {currentUser.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/mail/settings")}>
              <UserRound className="mr-2 h-4 w-4" /> Manage your account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/mail/settings")}>
              <Settings className="mr-2 h-4 w-4" /> Mailbox settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/login")}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
