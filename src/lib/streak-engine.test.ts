import { describe, it, expect } from "vitest";
import { computeStreak, RefreshEvent } from "./streak-engine";

describe("computeStreak", () => {
  it("returns zero streak for empty events", () => {
    const result = computeStreak([], "2025-03-15");
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
    expect(result.totalCompleted).toBe(0);
    expect(result.canRecover).toBe(false);
  });

  it("counts a single day streak", () => {
    const events: RefreshEvent[] = [{ type: "daily_refresh_completed", date: "2025-03-15" }];
    const result = computeStreak(events, "2025-03-15");
    expect(result.currentStreak).toBe(1);
    expect(result.totalCompleted).toBe(1);
  });

  it("counts consecutive days", () => {
    const events: RefreshEvent[] = [
      { type: "daily_refresh_completed", date: "2025-03-13" },
      { type: "daily_refresh_completed", date: "2025-03-14" },
      { type: "daily_refresh_completed", date: "2025-03-15" },
    ];
    const result = computeStreak(events, "2025-03-15");
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  it("resets streak on gap", () => {
    const events: RefreshEvent[] = [
      { type: "daily_refresh_completed", date: "2025-03-10" },
      { type: "daily_refresh_completed", date: "2025-03-11" },
      // gap on 12
      { type: "daily_refresh_completed", date: "2025-03-13" },
      { type: "daily_refresh_completed", date: "2025-03-14" },
    ];
    const result = computeStreak(events, "2025-03-14");
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(2);
  });

  it("canRecover is true when yesterday missed but day-before completed", () => {
    const events: RefreshEvent[] = [
      { type: "daily_refresh_completed", date: "2025-03-13" },
      // missed 14
    ];
    const result = computeStreak(events, "2025-03-15");
    expect(result.canRecover).toBe(true);
  });

  it("canRecover is false if yesterday was completed", () => {
    const events: RefreshEvent[] = [
      { type: "daily_refresh_completed", date: "2025-03-14" },
    ];
    const result = computeStreak(events, "2025-03-15");
    expect(result.canRecover).toBe(false);
  });

  it("recovery_completed counts as a completed day", () => {
    const events: RefreshEvent[] = [
      { type: "daily_refresh_completed", date: "2025-03-13" },
      { type: "recovery_completed", date: "2025-03-14" },
      { type: "daily_refresh_completed", date: "2025-03-15" },
    ];
    const result = computeStreak(events, "2025-03-15");
    expect(result.currentStreak).toBe(3);
  });

  it("viewed-only events don't count toward streak", () => {
    const events: RefreshEvent[] = [
      { type: "daily_refresh_viewed", date: "2025-03-14" },
    ];
    const result = computeStreak(events, "2025-03-15");
    expect(result.currentStreak).toBe(0);
    expect(result.totalCompleted).toBe(0);
  });
});
