import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
