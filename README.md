# mindrent

MindRent is a Next.js + Tailwind CSS app scaffolded around the local brand
instructions in `agents.md`.

## Commands

```bash
npm run dev
npm run lint
npm test
npm run build
```

## AI Setup

Copy `.env.local.example` to `.env.local` and set `GEMINI_API_KEY`. The quiz
uses a Next.js Server Action, so the Gemini key stays server-side and is never
sent to the browser. Without a key, the app uses a local development fallback so
the onboarding flow can still be reviewed.

## Design System

- Background: soft light lavender `#eee1f3`
- Text and primary accents: deep MindRent purple `#31224f`
- Typography: rounded lowercase-first sans-serif stack
- UI language: soft floating containers, glassmorphism, continuous-line motion,
  mobile-first responsive layout

The logo is available to the app at `/mindrent-logo.jpeg`.
