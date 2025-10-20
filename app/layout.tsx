import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colin Rodrigues - Product & Strategy",
  description: "Interactive portfolio showcasing professional journey, projects, and expertise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-neutral-bg text-text">{children}</body>
    </html>
  );
}
