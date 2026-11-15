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
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#f6f8fc] px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #0b3d2a14 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white p-1.5 shadow-md ring-1 ring-black/5">
            <Image src="/logo.png" alt="Superior College crest" width={68} height={68} />
          </div>
          <h1 className="text-3xl font-bold text-[#0b3d2a]">Superior Mail</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Superior College Mian Channu · Learn Today. Lead Tomorrow.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Inbox className="h-5 w-5 text-primary" />
              Staff Sign In
            </CardTitle>
            <CardDescription>
              Use your college mailbox address to open your inbox.
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
                    required
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
                    required
                    placeholder="Your mailbox password"
                    className="pl-9 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="stay" defaultChecked />
                <Label htmlFor="stay" className="text-sm font-normal">
                  Stay signed in on this device
                </Label>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Sign in to your inbox
              </Button>

              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                This portal connects to the college mailbox on Hostinger. Sign-in
                verification starts in the next phase — for now this opens the design
                preview.
              </p>
            </form>
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
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Multan Road, near NADRA Office, Mian Channu
        </p>
      </div>

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
