import { notFound } from "next/navigation";
import { getCertBySlug, getAvailableCertSlugs } from "@/data/certs";
import ExamMode from "@/components/modes/ExamMode";

export function generateStaticParams() {
  return getAvailableCertSlugs().map((slug) => ({ cert: slug }));
}

export function generateMetadata({ params }: { params: { cert: string } }) {
  const cert = getCertBySlug(params.cert);
  if (!cert) return { title: "Not Found" };
  return {
    title: `${cert.name} Mock Exam`,
    description: `Take a timed mock exam for ${cert.name} with detailed score reports by domain.`,
  };
}

export default function ExamPage({ params }: { params: { cert: string } }) {
  const cert = getCertBySlug(params.cert);
  if (!cert || !cert.available) notFound();

  return <ExamMode cert={cert} backHref={`/${cert.slug}`} />;
}
