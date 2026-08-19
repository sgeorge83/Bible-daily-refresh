/**
 * Streak engine — computes streak from immutable event log.
 * Supports grace/recovery: a missed day can be "recovered" within 48 hours.
 */

export interface RefreshEvent {
  type: "daily_refresh_completed" | "daily_refresh_viewed" | "recovery_completed";
  date: string; // YYYY-MM-DD
}

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  canRecover: boolean; // true if yesterday was missed and recovery window is open
  lastCompletedDate: string | null;
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Compute streak from a list of events sorted by date ascending.
 * Rules:
 * - A day is "complete" if it has a daily_refresh_completed or recovery_completed event.
 * - A streak is consecutive completed days.
 * - Recovery window: if yesterday is missed but today is still within 48h, user can do a recovery.
 */
export function computeStreak(events: RefreshEvent[], todayStr: string): StreakResult {
  const completedDates = new Set<string>();
  for (const e of events) {
    if (e.type === "daily_refresh_completed" || e.type === "recovery_completed") {
      completedDates.add(e.date);
    }
  }

  const totalCompleted = completedDates.size;
  if (totalCompleted === 0) {
    return { currentStreak: 0, longestStreak: 0, totalCompleted: 0, canRecover: false, lastCompletedDate: null };
  }

  const sorted = Array.from(completedDates).sort();
  const lastCompletedDate = sorted[sorted.length - 1];

  // Compute longest streak
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === addDays(sorted[i - 1], 1)) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }

  // Compute current streak (counting backwards from today or yesterday)
  let current = 0;
  let checkDate = todayStr;

  if (completedDates.has(checkDate)) {
    current = 1;
    checkDate = addDays(checkDate, -1);
    while (completedDates.has(checkDate)) {
      current++;
      checkDate = addDays(checkDate, -1);
    }
  } else {
    // Today not done yet — check if yesterday continues the streak
    checkDate = addDays(todayStr, -1);
    if (completedDates.has(checkDate)) {
      current = 1;
      checkDate = addDays(checkDate, -1);
      while (completedDates.has(checkDate)) {
        current++;
        checkDate = addDays(checkDate, -1);
      }
    }
  }

  // Can recover? Yesterday missed AND day-before-yesterday was completed
  const yesterday = addDays(todayStr, -1);
  const dayBefore = addDays(todayStr, -2);
  const canRecover = !completedDates.has(yesterday) && completedDates.has(dayBefore) && !completedDates.has(todayStr);

  return { currentStreak: current, longestStreak: Math.max(longest, current), totalCompleted, canRecover, lastCompletedDate };
}
