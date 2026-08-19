# Daily Refresh — Bible Reading Habit App

A lightweight web app that helps busy professionals build a consistent Bible reading habit through tiny daily readings, reflection prompts, and a humane streak system with grace/recovery.

## Features

- **Daily Card**: 3–8 verse passage from the World English Bible (public domain) with 2 reflection prompts
- **Listen**: Text-to-speech for hands-free reading
- **Streak with Recovery**: Consecutive-day tracking with a 48-hour recovery window for missed days
- **History**: Browse past readings and reflections
- **Reminders**: In-app notifications at your chosen time (uses browser Notification API)
- **Friends** (opt-in): See friends' reading status

## Tech Stack

- Next.js 14 + TypeScript
- Tailwind CSS
- bible-api.com (World English Bible, public domain)
- Vitest for tests

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Running Tests

```bash
npm test
```

## License & Attribution

Scripture text: **World English Bible** — Public Domain.  
App code: MIT.
