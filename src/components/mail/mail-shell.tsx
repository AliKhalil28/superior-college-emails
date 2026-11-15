"use client";

import { useRouter } from "next/navigation";
import { SquarePen } from "lucide-react";
import { RightRail } from "@/components/mail/right-rail";
import { Sidebar } from "@/components/mail/sidebar";
import { Topbar } from "@/components/mail/topbar";

export function MailShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col bg-[#f6f8fc]">
      <Topbar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="mb-2 mr-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm md:mr-0">
          {children}
        </main>
        <RightRail />
      </div>

      {/* Mobile compose button */}
      <button
        onClick={() => router.push("/mail/compose")}
        className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c2e7ff] text-[#001d35] shadow-lg transition hover:shadow-xl md:hidden"
        aria-label="Compose"
      >
        <SquarePen className="h-6 w-6" />
      </button>
    </div>
  );
}
