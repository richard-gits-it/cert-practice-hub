import { notFound } from "next/navigation";
import { getCertBySlug, getAvailableCertSlugs } from "@/data/certs";
import CertHubView from "./CertHubView";

// Generate static params for available certs (better SEO + faster loads)
export function generateStaticParams() {
  return getAvailableCertSlugs().map((slug) => ({ cert: slug }));
}

// Per-page metadata
export function generateMetadata({ params }: { params: { cert: string } }) {
  const cert = getCertBySlug(params.cert);
  if (!cert) return { title: "Not Found" };
  return {
    title: `${cert.name} (${cert.code}) — Practice Hub`,
    description: `Free flashcards, mock exams, and practice drills for ${cert.name} certification.`,
  };
}

export default function CertPage({ params }: { params: { cert: string } }) {
  const cert = getCertBySlug(params.cert);
  if (!cert || !cert.available) notFound();

  return <CertHubView cert={cert} />;
}
