import type { Metadata } from "next";
import { AuthRedirectHandler } from "@/components/AuthRedirectHandler";
import "./globals.css";

export const metadata: Metadata = {
  title: "Driveway Deal Network",
  description:
    "Live from the driveway: deals you didn't know you needed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthRedirectHandler />
        {children}
      </body>
    </html>
  );
}
