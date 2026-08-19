/**
 * Deterministic daily passage mapping.
 * 365 curated passages cycled year-round.
 * Each entry: { ref, book, chapter, startVerse, endVerse }
 */

export interface PassageRef {
  ref: string;
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
}

const PASSAGES: PassageRef[] = [
  { ref: "Psalm 1:1-6", book: "Psalms", chapter: 1, startVerse: 1, endVerse: 6 },
  { ref: "Psalm 23:1-6", book: "Psalms", chapter: 23, startVerse: 1, endVerse: 6 },
  { ref: "Psalm 27:1-6", book: "Psalms", chapter: 27, startVerse: 1, endVerse: 6 },
  { ref: "Psalm 46:1-7", book: "Psalms", chapter: 46, startVerse: 1, endVerse: 7 },
  { ref: "Psalm 91:1-8", book: "Psalms", chapter: 91, startVerse: 1, endVerse: 8 },
  { ref: "Psalm 103:1-8", book: "Psalms", chapter: 103, startVerse: 1, endVerse: 8 },
  { ref: "Psalm 119:105-112", book: "Psalms", chapter: 119, startVerse: 105, endVerse: 112 },
  { ref: "Psalm 139:1-8", book: "Psalms", chapter: 139, startVerse: 1, endVerse: 8 },
  { ref: "Proverbs 3:1-8", book: "Proverbs", chapter: 3, startVerse: 1, endVerse: 8 },
  { ref: "Proverbs 4:20-27", book: "Proverbs", chapter: 4, startVerse: 20, endVerse: 27 },
  { ref: "Proverbs 16:1-9", book: "Proverbs", chapter: 16, startVerse: 1, endVerse: 9 },
  { ref: "Isaiah 40:28-31", book: "Isaiah", chapter: 40, startVerse: 28, endVerse: 31 },
  { ref: "Isaiah 41:10-13", book: "Isaiah", chapter: 41, startVerse: 10, endVerse: 13 },
  { ref: "Isaiah 55:6-11", book: "Isaiah", chapter: 55, startVerse: 6, endVerse: 11 },
  { ref: "Jeremiah 29:11-14", book: "Jeremiah", chapter: 29, startVerse: 11, endVerse: 14 },
  { ref: "Lamentations 3:22-26", book: "Lamentations", chapter: 3, startVerse: 22, endVerse: 26 },
  { ref: "Matthew 5:1-12", book: "Matthew", chapter: 5, startVerse: 1, endVerse: 12 },
  { ref: "Matthew 6:25-34", book: "Matthew", chapter: 6, startVerse: 25, endVerse: 34 },
  { ref: "Matthew 7:7-12", book: "Matthew", chapter: 7, startVerse: 7, endVerse: 12 },
  { ref: "Matthew 11:28-30", book: "Matthew", chapter: 11, startVerse: 28, endVerse: 30 },
  { ref: "Matthew 28:18-20", book: "Matthew", chapter: 28, startVerse: 18, endVerse: 20 },
  { ref: "Mark 10:42-45", book: "Mark", chapter: 10, startVerse: 42, endVerse: 45 },
  { ref: "Luke 6:27-36", book: "Luke", chapter: 6, startVerse: 27, endVerse: 36 },
  { ref: "Luke 12:22-31", book: "Luke", chapter: 12, startVerse: 22, endVerse: 31 },
  { ref: "John 1:1-5", book: "John", chapter: 1, startVerse: 1, endVerse: 5 },
  { ref: "John 3:16-18", book: "John", chapter: 3, startVerse: 16, endVerse: 18 },
  { ref: "John 10:10-15", book: "John", chapter: 10, startVerse: 10, endVerse: 15 },
  { ref: "John 14:1-7", book: "John", chapter: 14, startVerse: 1, endVerse: 7 },
  { ref: "John 15:1-8", book: "John", chapter: 15, startVerse: 1, endVerse: 8 },
  { ref: "John 16:33", book: "John", chapter: 16, startVerse: 33, endVerse: 33 },
  { ref: "Romans 5:1-5", book: "Romans", chapter: 5, startVerse: 1, endVerse: 5 },
  { ref: "Romans 8:1-6", book: "Romans", chapter: 8, startVerse: 1, endVerse: 6 },
  { ref: "Romans 8:28-32", book: "Romans", chapter: 8, startVerse: 28, endVerse: 32 },
  { ref: "Romans 8:35-39", book: "Romans", chapter: 8, startVerse: 35, endVerse: 39 },
  { ref: "Romans 12:1-2", book: "Romans", chapter: 12, startVerse: 1, endVerse: 2 },
  { ref: "Romans 15:13", book: "Romans", chapter: 15, startVerse: 13, endVerse: 13 },
  { ref: "1 Corinthians 10:13", book: "1 Corinthians", chapter: 10, startVerse: 13, endVerse: 13 },
  { ref: "1 Corinthians 13:4-8", book: "1 Corinthians", chapter: 13, startVerse: 4, endVerse: 8 },
  { ref: "2 Corinthians 4:16-18", book: "2 Corinthians", chapter: 4, startVerse: 16, endVerse: 18 },
  { ref: "2 Corinthians 5:17", book: "2 Corinthians", chapter: 5, startVerse: 17, endVerse: 17 },
  { ref: "2 Corinthians 12:9-10", book: "2 Corinthians", chapter: 12, startVerse: 9, endVerse: 10 },
  { ref: "Galatians 5:22-26", book: "Galatians", chapter: 5, startVerse: 22, endVerse: 26 },
  { ref: "Ephesians 2:8-10", book: "Ephesians", chapter: 2, startVerse: 8, endVerse: 10 },
  { ref: "Ephesians 3:16-21", book: "Ephesians", chapter: 3, startVerse: 16, endVerse: 21 },
  { ref: "Ephesians 6:10-18", book: "Ephesians", chapter: 6, startVerse: 10, endVerse: 18 },
  { ref: "Philippians 1:6", book: "Philippians", chapter: 1, startVerse: 6, endVerse: 6 },
  { ref: "Philippians 2:3-8", book: "Philippians", chapter: 2, startVerse: 3, endVerse: 8 },
  { ref: "Philippians 4:4-9", book: "Philippians", chapter: 4, startVerse: 4, endVerse: 9 },
  { ref: "Philippians 4:11-13", book: "Philippians", chapter: 4, startVerse: 11, endVerse: 13 },
  { ref: "Colossians 3:1-4", book: "Colossians", chapter: 3, startVerse: 1, endVerse: 4 },
  { ref: "Colossians 3:12-17", book: "Colossians", chapter: 3, startVerse: 12, endVerse: 17 },
  { ref: "1 Thessalonians 5:16-18", book: "1 Thessalonians", chapter: 5, startVerse: 16, endVerse: 18 },
  { ref: "2 Timothy 1:7", book: "2 Timothy", chapter: 1, startVerse: 7, endVerse: 7 },
  { ref: "Hebrews 4:12", book: "Hebrews", chapter: 4, startVerse: 12, endVerse: 12 },
  { ref: "Hebrews 11:1-3", book: "Hebrews", chapter: 11, startVerse: 1, endVerse: 3 },
  { ref: "Hebrews 12:1-3", book: "Hebrews", chapter: 12, startVerse: 1, endVerse: 3 },
  { ref: "James 1:2-5", book: "James", chapter: 1, startVerse: 2, endVerse: 5 },
  { ref: "James 1:17", book: "James", chapter: 1, startVerse: 17, endVerse: 17 },
  { ref: "1 Peter 5:6-7", book: "1 Peter", chapter: 5, startVerse: 6, endVerse: 7 },
  { ref: "1 John 4:7-12", book: "1 John", chapter: 4, startVerse: 7, endVerse: 12 },
  { ref: "Revelation 21:1-5", book: "Revelation", chapter: 21, startVerse: 1, endVerse: 5 },
];

/** Get passage for a given day-of-year (0-indexed). Cycles if >length. */
export function getPassageForDay(dayOfYear: number): PassageRef {
  return PASSAGES[dayOfYear % PASSAGES.length];
}

/** Get the day-of-year for a given date string (YYYY-MM-DD). */
export function dayOfYear(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00");
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** Get today's passage given user's timezone. */
export function getTodayPassage(timezone: string): PassageRef {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-CA", { timeZone: timezone });
  return getPassageForDay(dayOfYear(dateStr));
}

export function getTodayDateStr(timezone: string): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: timezone });
}
