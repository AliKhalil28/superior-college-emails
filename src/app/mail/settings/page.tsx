"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, MailCheck, PenLine, Plane, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { currentUser } from "@/lib/mock-data";

export default function SettingsPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(currentUser.name);
  const [defaultFrom, setDefaultFrom] = useState(currentUser.addresses[0]);
  const [signature, setSignature] = useState(
    `\n\n--\n${currentUser.name}\n${currentUser.role}\nSuperior College Mian Channu`
  );
  const [vacationOn, setVacationOn] = useState(false);
  const [vacationMsg, setVacationMsg] = useState(
    "Thank you for your email. I am currently away and will reply on my return. For urgent matters, please contact the college office."
  );

  useEffect(() => {
    const savedSig = window.localStorage.getItem("sm-signature");
    if (savedSig) setSignature(savedSig);
    const savedFrom = window.localStorage.getItem("sm-default-from");
    if (savedFrom) setDefaultFrom(savedFrom);
    const savedName = window.localStorage.getItem("sm-display-name");
    if (savedName) setDisplayName(savedName);
  }, []);

  const saveProfile = () => {
    window.localStorage.setItem("sm-display-name", displayName);
    toast.success("Profile saved");
  };

  const saveGeneral = () => {
    window.localStorage.setItem("sm-default-from", defaultFrom);
    window.localStorage.setItem("sm-signature", signature);
    toast.success("Settings saved — new messages will use this signature");
  };

  const saveVacation = () => {
    toast.success(
      vacationOn ? "Vacation responder turned on" : "Vacation responder saved (off)"
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-12 items-center gap-2 px-3 sm:px-4">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#5f6368] transition hover:bg-[#e8eaed]"
          aria-label="Back to mail"
          onClick={() => router.push("/mail")}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-medium text-[#202124]">Settings</h1>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl space-y-4 px-4 pb-8 pt-1 sm:px-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserRound className="h-5 w-5 text-[#0b3d2a]" /> Profile
              </CardTitle>
              <CardDescription>How you appear to people who receive your mail.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-[#0b3d2a] text-lg font-medium text-white">
                    {currentUser.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-sm text-muted-foreground">{currentUser.role}</p>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="display-name">Display name</Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Your addresses (aliases)</Label>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.addresses.map((addr) => (
                    <span
                      key={addr}
                      className="rounded-full bg-[#f2f6fc] px-3 py-1 text-xs text-[#202124]"
                    >
                      {addr}
                    </span>
                  ))}
                </div>
              </div>
              <Button onClick={saveProfile}>Save profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PenLine className="h-5 w-5 text-[#0b3d2a]" /> Sending & signature
              </CardTitle>
              <CardDescription>Default sending address and your email signature.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Send mail as (default)</Label>
                <Select
                  value={defaultFrom}
                  onValueChange={(v) => setDefaultFrom(v ?? currentUser.addresses[0])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentUser.addresses.map((addr) => (
                      <SelectItem key={addr} value={addr}>
                        {addr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signature">Signature</Label>
                <Textarea
                  id="signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="min-h-28"
                />
                <p className="text-xs text-muted-foreground">
                  Added automatically at the end of new messages you compose.
                </p>
              </div>
              <Button onClick={saveGeneral}>Save sending settings</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Plane className="h-5 w-5 text-[#0b3d2a]" /> Vacation responder
              </CardTitle>
              <CardDescription>
                Automatically reply to people who email you while you are away.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="vacation-switch">Vacation responder</Label>
                <Switch
                  id="vacation-switch"
                  checked={vacationOn}
                  onCheckedChange={setVacationOn}
                />
              </div>
              <Textarea
                value={vacationMsg}
                onChange={(e) => setVacationMsg(e.target.value)}
                className="min-h-24"
                disabled={!vacationOn}
              />
              <Button onClick={saveVacation} disabled={!vacationOn}>
                Save vacation responder
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <KeyRound className="h-5 w-5 text-[#0b3d2a]" /> Password & security
              </CardTitle>
              <CardDescription>
                Your password is the same as your Hostinger mailbox password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-pass">Current password</Label>
                <Input id="current-pass" type="password" placeholder="••••••••" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-pass">New password</Label>
                <Input id="new-pass" type="password" placeholder="••••••••" />
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  toast.info("Design preview", {
                    description:
                      "Password change connects to the Hostinger mailbox in the functionality phase. For now, contact the IT Department to reset it.",
                  })
                }
              >
                <MailCheck className="mr-2 h-4 w-4" /> Change password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
