"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SquarePen, X } from "lucide-react";
import { Sidebar } from "@/components/mail/sidebar";
import { Topbar } from "@/components/mail/topbar";

export function MailShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mini, setMini] = useState(false);

  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setDrawerOpen(true);
    } else {
      setMini((v) => !v);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#f6f8fc]">
      <Topbar onMenuClick={handleMenuClick} />
      <div className="relative flex min-h-0 flex-1">
        <Sidebar mini={mini} />
        <main className="mb-2 mr-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
          {children}
        </main>
      </div>

      {/* Mobile drawer with folders/labels */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-[#f6f8fc] shadow-xl">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-lg font-medium text-[#0b3d2a]">Superior Mail</p>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#5f6368] hover:bg-[#e8eaed]"
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar
              className="flex w-full flex-1 md:flex"
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}

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
