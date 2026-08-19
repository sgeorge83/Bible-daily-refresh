"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [timezone, setTimezone] = useState("");
  const [reminderTime, setReminderTime] = useState("08:00");
  const [saved, setSaved] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const stored = localStorage.getItem("dr_reminderTime");
    if (stored) setReminderTime(stored);
    setReminderEnabled(localStorage.getItem("dr_reminderEnabled") === "true");
  }, []);

  async function handleSave() {
    const userId = localStorage.getItem("dr_userId");
    if (!userId) return;
    localStorage.setItem("dr_reminderTime", reminderTime);
    localStorage.setItem("dr_reminderEnabled", String(reminderEnabled));
    await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, timezone, reminderTime }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-sky-800">Settings</h1>

      <div className="bg-white rounded-2xl border border-sky-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            {Intl.supportedValuesOf("timeZone").map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Daily Reminder Time</label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="reminder-toggle"
            checked={reminderEnabled}
            onChange={(e) => setReminderEnabled(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="reminder-toggle" className="text-sm text-gray-700">Enable in-app reminder notification</label>
        </div>

        <button
          onClick={handleSave}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-xl transition"
        >
          {saved ? "Saved ✓" : "Save Settings"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-sky-100 p-6 space-y-3">
        <h2 className="font-semibold text-sky-700">About</h2>
        <p className="text-sm text-gray-600">
          Daily Refresh helps busy people build a consistent Bible reading habit. Each day you receive a short passage from the
          World English Bible (public domain) with reflection prompts.
        </p>
        <p className="text-sm text-gray-600">
          Your reading streak includes grace: if you miss a day, you can recover within 48 hours without losing your streak.
        </p>
      </div>
    </div>
  );
}
