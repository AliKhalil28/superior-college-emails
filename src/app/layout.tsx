import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-context";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Superior Mail — Superior College Mian Channu",
  description:
    "Official email portal of Superior College Mian Channu. Sign in with your college mailbox to send and receive mail.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <AuthProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
