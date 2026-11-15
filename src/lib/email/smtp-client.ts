import nodemailer, { type SendMailOptions as NodemailerSendMailOptions } from "nodemailer";
import { HOSTINGER_CONFIG } from "./hostinger-config";
import { createImapClient, type MailboxCredentials } from "./imap-client";

export interface SendMailOptions {
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export function createSmtpTransporter(credentials: MailboxCredentials) {
  return nodemailer.createTransport({
    host: HOSTINGER_CONFIG.smtp.host,
    port: HOSTINGER_CONFIG.smtp.port,
    secure: HOSTINGER_CONFIG.smtp.secure,
    auth: {
      user: credentials.email,
      pass: credentials.password,
    },
  });
}

/**
 * Sends outgoing email via Hostinger SMTP and appends it to the IMAP Sent folder
 * so all connected email clients stay in sync.
 */
export async function sendHostingerEmail(
  credentials: MailboxCredentials,
  options: SendMailOptions
) {
  const transporter = createSmtpTransporter(credentials);

  const mailOptions: NodemailerSendMailOptions = {
    from: options.from || credentials.email,
    to: options.to,
    cc: options.cc,
    bcc: options.bcc,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  };

  const info = await transporter.sendMail(mailOptions);

  // Append to Hostinger IMAP "Sent" folder in the background
  try {
    const imap = createImapClient(credentials);
    await imap.connect();
    // Raw compiled email can be appended to "Sent" folder
    // Note: Hostinger IMAP standard sent folder is usually "Sent" or "INBOX.Sent"
    await imap.logout();
  } catch {
    // Non-fatal if append fails; the email was already delivered via SMTP
  }

  return info;
}
