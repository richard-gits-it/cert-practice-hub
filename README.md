# Cert Practice Hub

A free, no-login IT certification exam prep app covering CCNA, Network+, Security+, A+, and more.

**Live:** [cert-practice-hub.vercel.app](https://cert-practice-hub.vercel.app)

## Features

- **Flashcard Mode** — Flip-card drill organized by exam domain with filtering
- **Subnetting Drill** — Algorithmically generated problems with binary breakdowns (never repeats)
- **Mock Exam Simulator** — Timed practice exams with per-domain score reports
- **Progress Tracking** — Accuracy, streaks, and domain-level stats stored locally
- **Multi-Cert Architecture** — CCNA active at launch; Network+, Security+, A+ coming soon

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Data | Static JSON question bank |
| State | localStorage (no backend needed) |
| Hosting | Vercel (free tier) |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, fonts
│   ├── page.tsx            # App shell with view routing
│   └── globals.css         # Tailwind + custom styles
├── components/
│   ├── LandingPage.tsx     # Cert selector grid
│   ├── CertHub.tsx         # Mode selector for a cert
│   ├── ui/
│   │   └── shared.tsx      # StatBox, Badge, BackButton, ModeButton
│   └── modes/
│       ├── FlashcardMode.tsx
│       ├── ExamMode.tsx
│       └── SubnetDrill.tsx
├── data/
│   ├── certs.ts            # Certification definitions
│   ├── types.ts            # Question interface
│   ├── questions.ts        # Question loader
│   └── questions/
│       └── ccna.ts         # CCNA question bank (30 questions)
└── lib/
    ├── progress.ts         # localStorage progress tracking
    └── subnet.ts           # Subnetting engine (pure functions)
```

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/cert-practice-hub
cd cert-practice-hub
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding Questions

Add questions to `src/data/questions/ccna.ts` (or create a new file for another cert) following this schema:

```typescript
{
  id: "ccna-031",
  cert: "ccna",
  domain: "Network Fundamentals",
  type: "multiple_choice",  // or "flashcard"
  prompt: "Your question here?",
  options: ["A", "B", "C", "D"],  // empty array for flashcards
  correct_answer: "B",
  explanation: "Why B is correct..."
}
```

Then register the new bank in `src/data/questions.ts`.

## Enabling a New Cert

1. Set `available: true` in `src/data/certs.ts`
2. Create `src/data/questions/[slug].ts`
3. Import and register in `src/data/questions.ts`

## Roadmap

- [ ] Spaced repetition (SM-2) for flashcard scheduling
- [ ] Cloud sync via Supabase + GitHub OAuth
- [ ] Lab scenario questions with topology diagrams
- [ ] Exportable study reports (PDF)
- [ ] Community question submissions

## License

MIT
