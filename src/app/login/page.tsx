"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Inbox, Lock, Mail, Send, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const features = [
  {
    icon: Users,
    title: "30 mailboxes, one plan",
    text: "Every staff member gets their own @superiorcollegemc.com address and login.",
  },
  {
    icon: Send,
    title: "Send & receive anywhere",
    text: "Mail moves through standard SMTP/IMAP, so the portal and mobile apps stay in sync.",
  },
  {
    icon: ShieldCheck,
    title: "Private & secure",
    text: "Your mail stays on the college's own mailbox — no personal Gmail or WhatsApp for official work.",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-[#0b3d2a] p-10 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white p-1">
            <Image src="/logo.png" alt="Superior College crest" width={48} height={48} />
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight">Superior College</p>
            <p className="text-sm text-emerald-200/90">Mian Channu</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <p className="mb-3 inline-block rounded-full border border-[#c9a227]/50 bg-[#c9a227]/10 px-3 py-1 text-xs font-medium tracking-wide text-[#e8c96a]">
            OFFICIAL EMAIL PORTAL
          </p>
          <h1 className="text-4xl font-bold leading-tight">
            Superior Mail
            <span className="mt-1 block text-xl font-medium text-emerald-100/90">
              Learn Today. Lead Tomorrow.
            </span>
          </h1>
          <div className="mt-8 space-y-5">
            {features.map((f) => (
              <div key={f.title} className="flex gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <f.icon className="h-5 w-5 text-[#e8c96a]" />
                </div>
                <div>
                  <p className="font-medium">{f.title}</p>
                  <p className="text-sm leading-relaxed text-emerald-100/75">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-emerald-100/60">
          Multan Road, near NADRA Office, Mian Channu · mail.superiorcollegemc.com
        </p>
      </section>

      {/* Login panel */}
      <section className="flex items-center justify-center bg-muted/40 p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center lg:hidden">
            <div className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow">
              <Image src="/logo.png" alt="Superior College crest" width={56} height={56} />
            </div>
            <h1 className="text-2xl font-bold text-[#0b3d2a]">Superior Mail</h1>
            <p className="text-sm text-muted-foreground">Superior College Mian Channu</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>
                Use your college mailbox address and password to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = "/mail";
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.name@superiorcollegemc.com"
                      className="pl-9"
                      autoComplete="username"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/login" className="text-xs font-medium text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-9 pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Keep me signed in on this device
                  </Label>
                </div>
                <Button type="submit" className="w-full" size="lg">
                  <Inbox className="mr-2 h-4 w-4" />
                  Sign in to Superior Mail
                </Button>
              </form>
              <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-center text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                Design preview — sign-in connects to the Hostinger mailbox in the functionality
                phase.
              </p>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Facing a problem with your mailbox? Contact the IT Department ·
            it@superiorcollegemc.com
          </p>
        </div>
      </section>
    </main>
  );
}
