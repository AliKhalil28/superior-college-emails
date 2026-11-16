"use client";

import Image from "next/image";

interface GmailLoadingScreenProps {
  progress?: number;
  statusText?: string;
  subText?: string;
}

export function GmailLoadingScreen({
  progress,
  statusText = "Loading Superior Mail…",
  subText = "Superior College Mian Channu · Learn Today. Lead Tomorrow.",
}: GmailLoadingScreenProps) {
  const isDeterminate = typeof progress === "number";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-white px-4 py-12 select-none animate-in fade-in duration-300">
      {/* Top spacer */}
      <div />

      {/* Center content: Crest, Logo, Progress bar, Status */}
      <div className="flex flex-col items-center text-center">
        {/* College Crest in Gmail-style elevated circle */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white p-2 shadow-sm ring-1 ring-black/5 animate-pulse">
          <Image
            src="/logo.png"
            alt="Superior College crest"
            width={68}
            height={68}
            priority
          />
        </div>

        {/* Branded Superior Mail title */}
        <h1 className="text-2xl font-normal tracking-tight text-[#202124]">
          Superior <span className="font-semibold text-[#0b3d2a]">Mail</span>
        </h1>

        {/* Gmail-style slim animated progress bar */}
        <div className="mt-8 h-1 w-64 overflow-hidden rounded-full bg-[#e8eaed]">
          {isDeterminate ? (
            <div
              className="h-full rounded-full bg-[#0b3d2a] transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          ) : (
            <div className="h-full w-2/5 rounded-full bg-[#0b3d2a] animate-[gmail-progress_1.4s_ease-in-out_infinite]" />
          )}
        </div>

        {/* Status text */}
        <p className="mt-3 text-xs font-normal text-[#5f6368] transition-all duration-200">
          {statusText}
        </p>
      </div>

      {/* Bottom college brand footer */}
      <div className="text-center">
        <p className="text-xs text-[#5f6368]">{subText}</p>
        <p className="mt-1 text-[11px] text-[#5f6368]/70">
          Connected to Hostinger Email Infrastructure · superiorcollegemc.com
        </p>
      </div>
    </div>
  );
}
