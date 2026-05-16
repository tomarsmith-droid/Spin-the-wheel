# Decision Wheel Pro

A premium, animated decision-making wheel built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Six game modes**: Classic · Elimination · Tournament · Party · Date Night · Weighted
- **Beautiful wheel**: realistic spin physics, ticking sounds, confetti, haptic feedback
- **Saved wheels** with rename, duplicate, favorites, and local persistence
- **Stats**: total spins, streaks, average duration, most picked, by-mode breakdown
- **Settings**: theme, animation intensity, spin speed, sound, haptics, particles
- **Mobile-first**: bottom nav, drag-to-dismiss sheets, glassmorphism, dynamic safe-area
- **Dark / Light mode**
- **Zero backend**: everything saved in `localStorage`. Deploy anywhere static.

## Stack

- Next.js 15 (App Router, static export-friendly)
- React 19, TypeScript strict
- Tailwind CSS 3
- Framer Motion
- Zustand (persisted)
- canvas-confetti
- Lightweight WebAudio-generated sound design (no audio assets)

## Run locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Deploy

This project is fully static and ready for Vercel:

```bash
npx vercel --prod
```

Or any static host — just run `npm run build` and serve `.next`.

## Project structure

```
app/                Next.js App Router routes (one per mode + saved/stats/settings)
components/         Reusable UI (Wheel, ModeCard, ResultModal, …)
lib/                Domain logic — types, store, presets, sound, color utilities
```
