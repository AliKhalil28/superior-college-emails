export const HOSTINGER_CONFIG = {
  imap: {
    host: process.env.HOSTINGER_IMAP_HOST || "imap.hostinger.com",
    port: parseInt(process.env.HOSTINGER_IMAP_PORT || "993", 10),
    secure: process.env.HOSTINGER_IMAP_SECURE !== "false", // SSL/TLS on port 993
  },
  smtp: {
    host: process.env.HOSTINGER_SMTP_HOST || "smtp.hostinger.com",
    port: parseInt(process.env.HOSTINGER_SMTP_PORT || "465", 10),
    secure: process.env.HOSTINGER_SMTP_SECURE !== "false", // SSL on port 465 (or false for port 587 STARTTLS)
  },
};
