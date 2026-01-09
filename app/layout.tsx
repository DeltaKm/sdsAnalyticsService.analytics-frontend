import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Risto Analytics",
  description: "Dashboard",
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
