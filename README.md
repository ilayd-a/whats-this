# What's This?

**Turn confusing documents into clear answers.**

Upload a bill, notice, form, statement, screenshot, or email — get back a plain-English explanation of what it is, what matters, whether you owe anything or have a deadline, what's unusual, and what to do next.

## Why this exists

Confusing paperwork is one of the most universal, unglamorous sources of stress: bills with unclear due dates, notices full of jargon, statements no one reads carefully. It's also a perfect showcase for what a multimodal LLM is actually good at — reading messy real-world documents and turning them into something a person can act on in under 10 seconds.

This was built for HackMIT 2026, targeting Long Lake's **"Convince a Non-Believer"** challenge: the goal isn't a feature-packed platform, it's the single "aha" moment that could turn an AI skeptic into a believer — upload something confusing, get back something immediately, obviously useful. It also fits the **OpenAI challenge**, since the entire product is a thin, well-designed layer over the OpenAI API's document/image understanding.

## How it works (architecture)

- **Next.js App Router + TypeScript + Tailwind**, single page, no database, no auth, no external storage.
- The homepage (`app/page.tsx`) is a small client-side state machine: `idle → preview → loading → results | error`. No routing needed — everything happens in place.
- Uploading a file sends it to a server-only API route, `app/api/analyze/route.ts`, which:
  1. Validates file type (PDF/PNG/JPG) and size (≤10MB) server-side.
  2. Base64-encodes the file and sends it to OpenAI's **Responses API** (`gpt-4.1`) as either `input_image` (images) or `input_file` (PDFs) — no manual OCR.
  3. Requests a **strict JSON Schema** structured output (see `lib/schema.ts`) so the model always returns a predictable shape (`lib/types.ts`).
- The system prompt instructs the model to explain in plain language, never invent facts, and flag ambiguity — see `SYSTEM_PROMPT` in `lib/schema.ts`.
- The API key (`OPENAI_API_KEY`) is only ever read inside the server route; it is never sent to the browser.
- A **"Try a demo"** button shows a realistic canned result (`lib/sample-result.ts`) instantly, with no API call — so the demo never depends on network/API reliability.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- OpenAI API (`openai` SDK, Responses API with structured outputs)
- lucide-react for icons
- No database, no auth, no external storage

## Setup

```bash
npm install
cp .env.example .env.local
```

Add your OpenAI API key to `.env.local`:

```
OPENAI_API_KEY=sk-...
```

## Run locally

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

You can explore the full results experience immediately via the **"Try a demo"** button on the homepage — it works without any API key.

## Required environment variable

| Variable | Description |
| --- | --- |
| `OPENAI_API_KEY` | Your OpenAI API key. Used server-side only, in `app/api/analyze/route.ts`. |
