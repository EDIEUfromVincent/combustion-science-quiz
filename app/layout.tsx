import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "연소 탐험대 | 6학년 과학 시험",
  description: "6학년 1~5반 과학 시험과 결과 관리",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
