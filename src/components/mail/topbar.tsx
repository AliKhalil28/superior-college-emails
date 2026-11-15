"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Search, Settings, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { currentUser } from "@/lib/mock-data";

interface TopbarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function Topbar({ query, onQueryChange }: TopbarProps) {
  const router = useRouter();
  return (
    <header className="flex h-16 items-center gap-3 border-b bg-[#0b3d2a] px-4 text-white sm:gap-4 sm:px-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white p-0.5">
          <Image src="/logo.png" alt="Superior College crest" width={36} height={36} />
        </div>
        <div className="leading-tight">
          <p className="font-semibold">Superior Mail</p>
          <p className="hidden text-[11px] text-emerald-200/80 sm:block">
            Superior College Mian Channu
          </p>
        </div>
        <Badge className="ml-1 hidden bg-[#c9a227] text-[#231a00] hover:bg-[#c9a227] md:inline-flex">
          UI Design
        </Badge>
      </div>

      <div className="relative mx-auto w-full max-w-xl flex-1 px-2">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search mail — subject, sender, keyword…"
          className="border-0 bg-white/95 pl-9 text-foreground shadow-inner focus-visible:ring-2 focus-visible:ring-[#c9a227]"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <button
          className="hidden h-9 w-9 items-center justify-center rounded-full text-emerald-100 transition hover:bg-white/10 sm:flex"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full ring-2 ring-[#c9a227]/70 transition hover:ring-[#c9a227]">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-emerald-700 text-sm font-semibold text-white">
                {currentUser.initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{currentUser.role}</p>
              <p className="mt-0.5 truncate text-xs font-normal text-muted-foreground">
                {currentUser.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserRound className="mr-2 h-4 w-4" /> My profile
            </DropdownMenuItem>
            <DropdownMenuItem>
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
