"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { emails as seedEmails, type Email, type FolderId } from "@/lib/mock-data";

export interface ComposePrefill {
  to?: string;
  subject?: string;
  body?: string;
}

interface MailContextValue {
  emails: Email[];
  folder: FolderId;
  setFolder: (folder: FolderId) => void;
  query: string;
  setQuery: (query: string) => void;
  prefill: ComposePrefill | null;
  setPrefill: (prefill: ComposePrefill | null) => void;
  labelFilter: string | null;
  setLabelFilter: (label: string | null) => void;
  toggleStar: (id: string) => void;
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  markAllRead: (ids: string[]) => void;
  moveToFolder: (id: string, folder: FolderId) => void;
  addOutgoing: (email: Email) => void;
}

const MailContext = createContext<MailContextValue | null>(null);

export function MailProvider({ children }: { children: React.ReactNode }) {
  const [emails, setEmails] = useState<Email[]>(seedEmails);
  const [folder, setFolder] = useState<FolderId>("inbox");
  const [query, setQuery] = useState("");
  const [prefill, setPrefill] = useState<ComposePrefill | null>(null);
  const [labelFilter, setLabelFilter] = useState<string | null>(null);

  const toggleStar = useCallback((id: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e))
    );
  }, []);

  const markRead = useCallback((id: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, unread: false } : e))
    );
  }, []);

  const markUnread = useCallback((id: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, unread: true } : e))
    );
  }, []);

  const markAllRead = useCallback((ids: string[]) => {
    setEmails((prev) =>
      prev.map((e) => (ids.includes(e.id) ? { ...e, unread: false } : e))
    );
  }, []);

  const moveToFolder = useCallback((id: string, target: FolderId) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, folder: target } : e))
    );
  }, []);

  const addOutgoing = useCallback((email: Email) => {
    setEmails((prev) => [email, ...prev]);
  }, []);

  const value = useMemo(
    () => ({
      emails,
      folder,
      setFolder,
      query,
      setQuery,
      prefill,
      setPrefill,
      labelFilter,
      setLabelFilter,
      toggleStar,
      markRead,
      markUnread,
      markAllRead,
      moveToFolder,
      addOutgoing,
    }),
    [
      emails,
      folder,
      query,
      prefill,
      labelFilter,
      toggleStar,
      markRead,
      markUnread,
      markAllRead,
      moveToFolder,
      addOutgoing,
    ]
  );

  return <MailContext.Provider value={value}>{children}</MailContext.Provider>;
}

export function useMail() {
  const ctx = useContext(MailContext);
  if (!ctx) throw new Error("useMail must be used inside MailProvider");
  return ctx;
}
