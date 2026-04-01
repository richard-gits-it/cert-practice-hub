const PROGRESS_KEY = "certhub-progress";

export interface DomainProgress {
  attempted: number;
  correct: number;
}

export interface CertProgress {
  total: number;
  correct: number;
  streak: number;
  bestStreak: number;
  byDomain: Record<string, DomainProgress>;
  lastSeen?: string;
}

export function loadAllProgress(): Record<string, CertProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveAllProgress(data: Record<string, CertProgress>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  } catch {}
}

export function getCertProgress(cert: string): CertProgress {
  const all = loadAllProgress();
  return all[cert] || { total: 0, correct: 0, streak: 0, bestStreak: 0, byDomain: {} };
}

export function saveCertProgress(cert: string, data: CertProgress) {
  const all = loadAllProgress();
  all[cert] = { ...data, lastSeen: new Date().toISOString() };
  saveAllProgress(all);
}

export function recordAnswer(cert: string, domain: string, isCorrect: boolean) {
  const progress = getCertProgress(cert);
  progress.total++;
  if (isCorrect) progress.correct++;

  if (!progress.byDomain[domain]) {
    progress.byDomain[domain] = { attempted: 0, correct: 0 };
  }
  progress.byDomain[domain].attempted++;
  if (isCorrect) progress.byDomain[domain].correct++;

  saveCertProgress(cert, progress);
  return progress;
}
