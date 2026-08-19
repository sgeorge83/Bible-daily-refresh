/**
 * Client-side storage using localStorage.
 * Replaces Prisma DB for static GitHub Pages deployment.
 */

import { RefreshEvent } from "./streak-engine";

const EVENTS_KEY = "dr_events";
const USER_KEY = "dr_user";

export interface StoredUser {
  id: string;
  timezone: string;
  reminderTime: string;
}

export function getUser(): StoredUser {
  const raw = localStorage.getItem(USER_KEY);
  if (raw) return JSON.parse(raw);
  const user: StoredUser = {
    id: crypto.randomUUID(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    reminderTime: "08:00",
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function saveUser(user: StoredUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getEvents(): (RefreshEvent & { id: string; passageRef: string; reflection?: string })[] {
  const raw = localStorage.getItem(EVENTS_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

export function addEvent(event: { type: RefreshEvent["type"]; date: string; passageRef: string; reflection?: string }) {
  const events = getEvents();
  events.push({ ...event, id: crypto.randomUUID() });
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}
