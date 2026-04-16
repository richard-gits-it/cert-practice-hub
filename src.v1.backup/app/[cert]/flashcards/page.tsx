import { notFound } from "next/navigation";
import { getCertBySlug, getAvailableCertSlugs } from "@/data/certs";
import FlashcardMode from "@/components/modes/FlashcardMode";

export function generateStaticParams() {
  return getAvailableCertSlugs().map((slug) => ({ cert: slug }));
}

export function generateMetadata({ params }: { params: { cert: string } }) {
  const cert = getCertBySlug(params.cert);
  if (!cert) return { title: "Not Found" };
  return {
    title: `${cert.name} Flashcards`,
    description: `Practice ${cert.name} concepts with flip-card flashcards organized by exam domain.`,
  };
}

export default function FlashcardsPage({ params }: { params: { cert: string } }) {
  const cert = getCertBySlug(params.cert);
  if (!cert || !cert.available) notFound();

  return <FlashcardMode cert={cert} backHref={`/${cert.slug}`} />;
}
