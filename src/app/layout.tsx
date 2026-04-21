import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { JetBrains_Mono } from "next/font/google";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Cert Practice Hub — Free IT Certification Exam Prep",
    template: "%s | Cert Practice Hub",
  },
  description:
    "Free, no-login exam prep for CCNA, Network+, Security+, A+ and more. Flashcards, subnetting drills, and timed mock exams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrains.className} bg-bg-primary bg-mesh min-h-screen antialiased`}>
        <Nav />
        <main className="max-w-2xl mx-auto px-4 pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}