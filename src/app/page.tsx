"use client";

import { useState } from "react";
import { Cert } from "@/data/certs";
import LandingPage from "@/components/LandingPage";
import CertHub from "@/components/CertHub";
import FlashcardMode from "@/components/modes/FlashcardMode";
import ExamMode from "@/components/modes/ExamMode";
import SubnetDrill from "@/components/modes/SubnetDrill";

type View = "landing" | "certHub" | "flashcards" | "exam" | "subnet";

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const [activeCert, setActiveCert] = useState<Cert | null>(null);

  const nav = (v: View, cert?: Cert | null) => {
    setView(v);
    if (cert !== undefined) setActiveCert(cert);
  };

  return (
    <>
      {view === "landing" && (
        <LandingPage
          onSelectCert={(cert) => nav("certHub", cert)}
          onSubnet={() => nav("subnet")}
        />
      )}

      {view === "certHub" && activeCert && (
        <CertHub
          cert={activeCert}
          onBack={() => nav("landing", null)}
          onFlashcards={() => nav("flashcards")}
          onExam={() => nav("exam")}
          onSubnet={() => nav("subnet")}
        />
      )}

      {view === "flashcards" && activeCert && (
        <FlashcardMode
          cert={activeCert}
          onBack={() => nav("certHub", activeCert)}
        />
      )}

      {view === "exam" && activeCert && (
        <ExamMode
          cert={activeCert}
          onBack={() => nav("certHub", activeCert)}
        />
      )}

      {view === "subnet" && (
        <SubnetDrill
          onBack={() =>
            nav(activeCert ? "certHub" : "landing", activeCert)
          }
        />
      )}
    </>
  );
}
