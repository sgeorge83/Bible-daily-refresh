# Daily Refresh — Bible Reading Habit App

A lightweight web app that helps busy professionals build a consistent Bible reading habit through tiny daily readings, reflection prompts, and a humane streak system with grace/recovery.

**Live:** [https://sgeorge83.github.io/Bible-daily-refresh/](https://sgeorge83.github.io/Bible-daily-refresh/)

---

## Product Vision

Busy people want to engage with God's Word daily but struggle with consistency. Daily Refresh solves this by delivering one short, encouraging passage per day (1–3 minutes to read) paired with reflection prompts — building a sustainable habit through gentle streaks and recovery rather than guilt.

---

## Features

### Daily Card (1–3 minutes)
- A short passage (2–12 verses) from the **World English Bible** (public domain)
- Two reflection prompts to help you think and respond
- "Listen" button — text-to-speech using the browser's native Speech API

### 365-Day Reading Plan
- One unique passage per day for a full year — no repeats
- Covers the entire Bible from Genesis to Revelation
- Organized thematically by month (see plan below)

### Streak with Recovery (Grace Period)
- Tracks consecutive days of completed readings
- If you miss a day, you have **48 hours** to do a "recovery refresh" and keep your streak alive
- No guilt, no punishment — just gentle encouragement to come back

### Reading History
- Browse all past readings with dates and your reflections
- See which days were regular completions vs. recoveries

### Reminders
- Set a daily reminder time in Settings
- Uses browser Notification API (opt-in, no server needed)

### Optional Friend Check-ins (Phase 2)
- Add friends to see their reading status
- Low-pressure accountability — no leaderboards, no guilt nudges

---

## 365-Day Reading Plan

| Month | Days | Focus | Books |
|-------|------|-------|-------|
| January | 1–31 | Creation, Covenant & Praise | Genesis, Exodus, Deuteronomy, Joshua, Samuel, Kings, Chronicles, Nehemiah, Job, Psalms |
| February | 32–59 | Trust, Comfort & Worship | Psalms 19–84 |
| March | 60–90 | Prayer, Faithfulness & Praise | Psalms 86–150 |
| April | 91–120 | Wisdom & Prophecy Begins | Proverbs, Ecclesiastes, Song of Solomon, Isaiah 1–26 |
| May | 121–151 | Comfort & The Prophets | Isaiah 30–61, Jeremiah, Lamentations, Ezekiel, Daniel, Minor Prophets |
| June | 152–181 | Jesus' Teaching & Ministry | Matthew, Mark |
| July | 182–212 | Parables, Compassion & Truth | Luke, John (beginning) |
| August | 213–243 | Life in Christ & Early Church | John, Acts, Romans (beginning) |
| September | 244–273 | Grace, Love & Spiritual Gifts | Romans, 1 & 2 Corinthians |
| October | 274–304 | Freedom, Identity & Unity | Galatians, Ephesians, Philippians, Colossians |
| November | 305–334 | Faith, Endurance & Practical Wisdom | 1 & 2 Thessalonians, Timothy, Titus, Hebrews, James, 1 Peter |
| December | 335–365 | Hope, Victory & Eternity | 1 & 2 Peter, 1 John, Jude, Revelation |

---

## How It Works

### Passage Selection
- 365 curated passages are stored in `src/lib/daily-passages.ts`
- The app calculates the **day-of-year** from today's date (in your timezone)
- Maps deterministically: `PASSAGES[dayOfYear % 365]`
- Same day = same passage for all users in the same timezone

### Bible Text
- Fetched live from [bible-api.com](https://bible-api.com) using the World English Bible (WEB) translation
- Public domain — no API key, no copyright restrictions
- Results cached in memory during your session

### Streak Engine
- Stores immutable completion events in localStorage
- Event types: `daily_refresh_completed`, `recovery_completed`, `daily_refresh_viewed`
- Computes current streak, longest streak, and total completed
- Recovery logic: if yesterday was missed but the day before was completed, you can recover

### Text-to-Speech
- Uses the browser's native `SpeechSynthesis` API
- No external service or API key required
- Works in Chrome, Edge, Firefox, Safari

---

## Tech Stack

- **Framework:** Next.js 14 (static export for GitHub Pages)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data:** localStorage (fully client-side, no backend needed)
- **Bible API:** [bible-api.com](https://bible-api.com) (World English Bible, public domain)
- **Testing:** Vitest
- **Hosting:** GitHub Pages
- **CI:** GitHub Actions

---

## Getting Started (Local Development)

```bash
git clone https://github.com/sgeorge83/Bible-daily-refresh.git
cd Bible-daily-refresh
npm install
npm run dev
```

Open http://localhost:3000/Bible-daily-refresh

## Running Tests

```bash
npm test
```

## Deployment

The app deploys automatically to GitHub Pages via GitHub Actions on every push to `main`. No server or database required — everything runs in the browser.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Daily card (main page)
│   ├── history/page.tsx      # Reading history
│   ├── settings/page.tsx     # Timezone, reminders, about
│   ├── layout.tsx            # Shell layout with nav
│   ├── globals.css           # Tailwind base styles
│   └── providers.tsx         # Reminder bootstrap
├── lib/
│   ├── daily-passages.ts     # 365 curated passages with day mapping
│   ├── reflection-prompts.ts # 15 reflection prompts (2 per day)
│   ├── text-provider.ts      # Fetches WEB text from bible-api.com
│   ├── streak-engine.ts      # Streak computation with recovery
│   ├── streak-engine.test.ts # Unit tests for streak logic
│   ├── storage.ts            # localStorage persistence layer
│   └── reminder.ts           # Browser Notification API reminders
```

---

## Design Principles

1. **Tiny habit, big impact** — Keep the daily ask small (1–3 minutes) so it's easy to show up
2. **Grace over guilt** — Recovery windows and no shame for missed days
3. **Spiritual growth first** — Gamification serves the reading, not the other way around
4. **No barriers** — No sign-up required, no server, no cost, public domain Scripture
5. **Privacy** — All data stays in your browser (localStorage)

---

## License & Attribution

- Scripture text: **World English Bible** — Public Domain ([ebible.org/web](https://ebible.org/web/))
- App code: MIT
