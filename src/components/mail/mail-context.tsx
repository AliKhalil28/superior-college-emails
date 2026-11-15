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
  toggleStar: (id: string) => void;
  markRead: (id: string) => void;
  moveToFolder: (id: string, folder: FolderId) => void;
  addOutgoing: (email: Email) => void;
}

const MailContext = createContext<MailContextValue | null>(null);

export function MailProvider({ children }: { children: React.ReactNode }) {
  const [emails, setEmails] = useState<Email[]>(seedEmails);
  const [folder, setFolder] = useState<FolderId>("inbox");
  const [query, setQuery] = useState("");
  const [prefill, setPrefill] = useState<ComposePrefill | null>(null);

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
      toggleStar,
      markRead,
      moveToFolder,
      addOutgoing,
    }),
    [emails, folder, query, prefill, toggleStar, markRead, moveToFolder, addOutgoing]
  );

  return <MailContext.Provider value={value}>{children}</MailContext.Provider>;
}

export function useMail() {
  const ctx = useContext(MailContext);
  if (!ctx) throw new Error("useMail must be used inside MailProvider");
  return ctx;
}
