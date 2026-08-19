"use client";

import { useEffect, useState } from "react";
import { getEvents } from "@/lib/storage";

interface HistoryEvent {
  id: string;
  date: string;
  passageRef: string;
  reflection?: string;
  type: string;
}

export default function HistoryPage() {
  const [events, setEvents] = useState<HistoryEvent[]>([]);

  useEffect(() => {
    const all = getEvents()
      .filter((e) => e.type === "daily_refresh_completed" || e.type === "recovery_completed")
      .sort((a, b) => b.date.localeCompare(a.date));
    setEvents(all);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-sky-800">Reading History</h1>
      {events.length === 0 ? (
        <p className="text-gray-500">No readings yet. Complete today&apos;s refresh to start your journey!</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="bg-white rounded-xl border border-sky-100 p-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-sky-700">{e.passageRef}</p>
                {e.reflection && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{e.reflection}</p>}
                {e.type === "recovery_completed" && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mt-1 inline-block">Recovery</span>
                )}
              </div>
              <span className="text-xs text-gray-400 shrink-0">{e.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
