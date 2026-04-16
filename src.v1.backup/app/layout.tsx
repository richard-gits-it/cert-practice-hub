import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: {
    default: "Cert Practice Hub — Free IT Certification Exam Prep",
    template: "%s | Cert Practice Hub",
  },
  description:
    "Free, no-login exam prep for CCNA, Network+, Security+, A+ and more. Flashcards, subnetting drills, and timed mock exams.",
  keywords: ["CCNA", "CompTIA", "Network+", "Security+", "A+", "exam prep", "flashcards", "subnetting"],
  openGraph: {
    title: "Cert Practice Hub",
    description: "Free IT certification exam prep — flashcards, subnetting drills, mock exams.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg-primary bg-mesh min-h-screen antialiased">
        <Nav />
        <main className="max-w-2xl mx-auto px-4 pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}
