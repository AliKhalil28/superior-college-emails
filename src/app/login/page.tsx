"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Inbox, Lock, Mail, MailQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel — campus hero image from superiorcollegemc.com */}
      <section className="relative hidden flex-col justify-between overflow-hidden text-white lg:flex">
        <Image
          src="/campus-hero.jpg"
          alt="Superior College Mian Channu campus"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06231a]/90 via-[#06231a]/10 to-[#06231a]/30" />

        <div className="relative flex items-center gap-3 p-10">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-lg">
            <Image src="/logo.png" alt="Superior College crest" width={48} height={48} />
          </div>
          <div className="drop-shadow">
            <p className="text-lg font-semibold leading-tight">Superior College</p>
            <p className="text-sm text-white/85">Mian Channu</p>
          </div>
        </div>

        <div className="relative p-10">
          <p className="mb-3 inline-block rounded-full border border-[#c9a227]/60 bg-black/25 px-3 py-1 text-xs font-medium tracking-wide text-[#e8c96a] backdrop-blur-sm">
            OFFICIAL EMAIL PORTAL
          </p>
          <h1 className="text-4xl font-bold leading-tight drop-shadow">
            Superior Mail
            <span className="mt-1 block text-xl font-medium text-white/90">
              Learn Today. Lead Tomorrow.
            </span>
          </h1>
          <p className="mt-4 text-xs text-white/70">
            Multan Road, near NADRA Office, Mian Channu · mail.superiorcollegemc.com
          </p>
        </div>
      </section>

      {/* Login panel */}
      <section className="flex items-center justify-center bg-muted/40 p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <div className="relative mb-5 h-44 w-full overflow-hidden rounded-2xl">
              <Image
                src="/campus-hero.jpg"
                alt="Superior College Mian Channu campus"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06231a]/80 to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white p-0.5">
                  <Image src="/logo.png" alt="Superior College crest" width={36} height={36} />
                </div>
                <div className="text-white drop-shadow">
                  <p className="font-semibold leading-tight">Superior Mail</p>
                  <p className="text-xs text-white/85">Superior College Mian Channu</p>
                </div>
              </div>
            </div>
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
                  router.push("/mail");
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
                    <button
                      type="button"
                      onClick={() => setForgotOpen(true)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
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
            Facing a problem with your mailbox? Contact the IT Department ·{" "}
            <a
              href="mailto:it@superiorcollegemc.com"
              className="font-medium text-primary hover:underline"
            >
              it@superiorcollegemc.com
            </a>
          </p>
        </div>
      </section>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MailQuestion className="h-5 w-5 text-primary" />
              Reset your password
            </DialogTitle>
            <DialogDescription>
              For security, mailbox passwords are reset by the IT Department — staff
              cannot reset them directly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p>1. Email the IT Department from any account you can access, or visit the IT Office.</p>
            <p>2. Share your full college email address and staff ID for verification.</p>
            <p>3. You will receive a new temporary password, which you can change after signing in.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setForgotOpen(false)}>
              Close
            </Button>
            <Button>
              <a href="mailto:it@superiorcollegemc.com?subject=Password%20reset%20request%20—%20Superior%20Mail">
                Email IT Department
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
