import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { HOSTINGER_CONFIG } from "./hostinger-config";

export interface MailboxCredentials {
  email: string;
  password: string;
}

export function createImapClient(credentials: MailboxCredentials): ImapFlow {
  return new ImapFlow({
    host: HOSTINGER_CONFIG.imap.host,
    port: HOSTINGER_CONFIG.imap.port,
    secure: HOSTINGER_CONFIG.imap.secure,
    auth: {
      user: credentials.email,
      pass: credentials.password,
    },
    logger: false,
  });
}

/**
 * Validates staff mailbox credentials directly against Hostinger IMAP.
 * Returns true if login succeeds; throws informative error otherwise.
 */
export async function verifyHostingerMailbox(credentials: MailboxCredentials): Promise<boolean> {
  const client = createImapClient(credentials);
  try {
    await client.connect();
    await client.logout();
    return true;
  } catch (error: unknown) {
    const err = error as { responseStatus?: string; message?: string };
    throw new Error(err.message || "Failed to authenticate with Hostinger mail server");
  }
}

/**
 * Fetches recent messages from a Hostinger IMAP mailbox folder (e.g. 'INBOX').
 */
export async function fetchRecentFolderMessages(
  credentials: MailboxCredentials,
  folder = "INBOX",
  limit = 20
) {
  const client = createImapClient(credentials);
  const messages: Array<{
    uid: number;
    seq: number;
    subject: string;
    from: { name: string; address: string };
    to: string;
    date: Date;
    unread: boolean;
    starred: boolean;
    bodyText: string;
    bodyHtml: string;
    attachments: Array<{ name: string; size: string; contentType: string }>;
  }> = [];

  try {
    await client.connect();
    const lock = await client.getMailboxLock(folder);

    try {
      // Fetch latest messages in reverse order
      const status = await client.status(folder, { messages: true });
      const totalMessages = status && typeof status === "object" ? status.messages || 0 : 0;

      if (totalMessages > 0) {
        const startSeq = Math.max(1, totalMessages - limit + 1);
        const range = `${startSeq}:${totalMessages}`;

        for await (const message of client.fetch(range, {
          envelope: true,
          flags: true,
          source: true,
          uid: true,
        })) {
          if (!message.source) continue;
          const parsed = await simpleParser(message.source);

          const fromName =
            parsed.from?.value?.[0]?.name ||
            parsed.from?.value?.[0]?.address?.split("@")[0] ||
            "Unknown";
          const fromAddress = parsed.from?.value?.[0]?.address || credentials.email;
          const toAddress =
            parsed.to && !Array.isArray(parsed.to)
              ? parsed.to.text
              : Array.isArray(parsed.to)
                ? parsed.to.map((t) => t.text).join(", ")
                : credentials.email;

          const attachments = (parsed.attachments || []).map((att) => ({
            name: att.filename || "attachment",
            size:
              att.size > 1024 * 1024
                ? `${(att.size / (1024 * 1024)).toFixed(1)} MB`
                : `${Math.max(1, Math.round(att.size / 1024))} KB`,
            contentType: att.contentType,
          }));

          messages.unshift({
            uid: message.uid,
            seq: message.seq,
            subject: parsed.subject || "(no subject)",
            from: { name: fromName, address: fromAddress },
            to: toAddress,
            date: parsed.date || new Date(),
            unread: !message.flags?.has("\\Seen"),
            starred: message.flags?.has("\\Flagged") ?? false,
            bodyText: parsed.text || "",
            bodyHtml: parsed.html || parsed.textAsHtml || "",
            attachments,
          });
        }
      }
    } finally {
      lock.release();
    }

    await client.logout();
    return messages;
  } catch (error) {
    try {
      await client.logout();
    } catch {}
    throw error;
  }
}
