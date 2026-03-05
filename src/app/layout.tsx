import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import PasswordGate from "@/components/PasswordGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScreenLens — AI UI/UX Analyzer",
  description: "Upload a UI screenshot and get expert UX analysis with annotated markers, severity ratings, and actionable fixes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <PasswordGate>{children}</PasswordGate>
      </body>
    </html>
  );
}
