# Superior Mail — Superior College Mian Channu

The official email portal of **Superior College Mian Channu**, built on top of the
college's Hostinger email plan (30 mailboxes on `superiorcollegemc.com`).

Every staff member signs in with their own college mailbox and can send and
receive mail from the browser — no personal Gmail/WhatsApp for official work.

## Status

**Phase 1 — UI design (current).** The complete interface is designed with
realistic sample data:

- `/login` — branded sign-in page (split layout, college crest, green/gold theme)
- `/mail` — three-pane mail app:
  - Sidebar: Compose, folders (Inbox, Starred, Sent, Drafts, Archive, Spam,
    Trash), labels, storage meter, plan summary
  - Message list: unread states, stars, labels, attachments, live search
  - Reading pane: full message view with attachments and Reply / Reply all /
    Forward
  - Compose dialog: From-address (alias) picker, To/Cc/Bcc, subject, body
- All interactions (folder switching, search, star, mark-as-read, reply
  pre-fill) work in the UI with mock data.

**Phase 2 — functionality (planned).**

- Sign-in against the Hostinger mailbox (IMAP authentication)
- Inbox sync over IMAP (`imap.hostinger.com:993`, SSL)
- Sending over SMTP (`smtp.hostinger.com:465` SSL / `587` TLS) — e.g.
  `imapflow` + `nodemailer` in route handlers / server actions
- Sent/Drafts stored back to the mailbox over IMAP so the portal and phone
  apps stay in sync
- Attachments upload/download, address book, admin panel for the 30 mailboxes

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- shadcn/ui components (Radix), lucide-react icons, sonner toasts

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000  → redirects to /login
npm run build   # production build
```

## Notes

- Mailbox domain: `superiorcollegemc.com`
- Brand: Superior deep green `#0b3d2a` + gold `#c9a227`, college crest in
  `public/logo.png`
- Sample emails in `src/lib/mock-data.ts` are placeholders for design only.
