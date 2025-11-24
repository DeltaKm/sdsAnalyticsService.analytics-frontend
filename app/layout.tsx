import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Risto Analytics",
  description: "Dashboard analytics per ristorazione multi-negozio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
