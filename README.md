# Cert Practice Hub

**Live:** [cert-practice-hub.vercel.app](https://cert-practice-hub.vercel.app)

## Features

- **Flashcard Mode** — Flip-card drill organized by exam domain with filtering
- **Subnetting Drill** — Algorithmically generated problems with binary breakdowns
- **Mock Exam Simulator** — Timed practice exams with per-domain score reports
- **Progress Tracking** — Accuracy, streaks, and domain-level stats stored locally
- **Multi-Cert Architecture** — CCNA active at launch; Network+, Security+, A+ coming soon
- **Real Routes** — Shareable URLs for every cert and mode (`/ccna/flashcards`, `/subnet`, etc.)

## Routes

| Path | Description |
|------|-------------|
| `/` | Cert selector landing page |
| `/[cert]` | Cert hub (e.g. `/ccna`) — mode selector + domain list |
| `/[cert]/flashcards` | Flashcard drill scoped to cert |
| `/[cert]/exam` | Timed mock exam |
| `/subnet` | Subnetting drill (shared across networking certs) |
| `/progress` | Personal stats dashboard |

Unknown certs or unavailable certs return a 404.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Data | Static TS question banks |
| State | localStorage (no backend needed) |
| Hosting | Vercel (free tier) |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout + sticky <Nav>
│   ├── page.tsx                # Landing — cert selector
│   ├── not-found.tsx           # 404 page
│   ├── globals.css             # Tailwind + custom CSS
│   ├── [cert]/
│   │   ├── page.tsx            # Server component — validates cert, renders <CertHubView>
│   │   ├── CertHubView.tsx     # Client component for the cert hub
│   │   ├── flashcards/page.tsx # Flashcard route
│   │   └── exam/page.tsx       # Mock exam route
│   ├── subnet/page.tsx         # Subnetting drill (shared)
│   └── progress/
│       ├── page.tsx            # Server wrapper
│       └── ProgressView.tsx    # Client component with stats UI
├── components/
│   ├── Nav.tsx                 # Sticky header with active link styling
│   ├── ui/shared.tsx           # StatBox, Badge, BackLink, ModeLink, ModeButton
│   └── modes/
│       ├── FlashcardMode.tsx
│       ├── ExamMode.tsx
│       └── SubnetDrill.tsx
├── data/
│   ├── certs.ts                # Cert definitions + helpers
│   ├── types.ts                # Question interface
│   ├── questions.ts            # Question loader
│   └── questions/
│       └── ccna.ts             # CCNA bank (200 questions)
└── lib/
    ├── progress.ts             # localStorage progress
    └── subnet.ts               # Subnetting engine
```

## Server vs Client Components

- **Server components** (`page.tsx` files): handle routing, metadata, and `notFound()` logic
- **Client components** (`*View.tsx`, components in `/modes/`): handle interactivity and localStorage

This split lets us:
- Generate per-page metadata for SEO
- Pre-render available cert routes via `generateStaticParams()`
- Keep heavy interactivity isolated to where it's needed

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/cert-practice-hub
cd cert-practice-hub
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding Questions

Add questions to `src/data/questions/ccna.ts` (or create a new file):

```typescript
{
  id: "ccna-031",
  cert: "ccna",
  domain: "Network Fundamentals",
  type: "multiple_choice",  // or "flashcard"
  prompt: "Your question?",
  options: ["A", "B", "C", "D"],  // empty array for flashcards
  correct_answer: "B",
  explanation: "Why B is correct..."
}
```

## Enabling a New Cert

1. Set `available: true` in `src/data/certs.ts`
2. Create `src/data/questions/[slug].ts`
3. Register the bank in `src/data/questions.ts`
4. Routes `/[slug]`, `/[slug]/flashcards`, `/[slug]/exam` work automatically via dynamic routing

## Roadmap

- [ ] Spaced repetition (SM-2) for flashcard scheduling
- [ ] Cloud sync via Supabase + GitHub OAuth
- [ ] Lab scenario questions with topology diagrams
- [ ] Exportable study reports (PDF)
- [ ] Community question submissions

## License

MIT
