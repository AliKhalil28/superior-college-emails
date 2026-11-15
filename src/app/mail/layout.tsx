import { MailProvider } from "@/components/mail/mail-context";
import { MailShell } from "@/components/mail/mail-shell";

export default function MailLayout({ children }: LayoutProps<"/mail">) {
  return (
    <MailProvider>
      <MailShell>{children}</MailShell>
    </MailProvider>
  );
}
