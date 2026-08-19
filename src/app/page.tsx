"use client";

import { useEffect, useState } from "react";
import { getTodayPassage, getTodayDateStr, dayOfYear } from "@/lib/daily-passages";
import { getPromptsForDay } from "@/lib/reflection-prompts";
import { fetchPassage, PassageResult } from "@/lib/text-provider";
import { computeStreak, StreakResult } from "@/lib/streak-engine";
import { getUser, getEvents, addEvent } from "@/lib/storage";

export default function DailyPage() {
  const [text, setText] = useState<PassageResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [reflection, setReflection] = useState("");
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState<StreakResult | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");

  const tz = typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";
  const dateStr = typeof window !== "undefined" ? getTodayDateStr(tz) : "";
  const doy = dateStr ? dayOfYear(dateStr) : 0;
  const passage = getTodayPassage(tz);
  const prompts = getPromptsForDay(doy);

  useEffect(() => {
    getUser();
    refreshStreak();
    checkAlreadyCompleted();
    fetchPassage(passage.ref)
      .then(setText)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function refreshStreak() {
    const events = getEvents();
    const today = getTodayDateStr(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setStreak(computeStreak(events, today));
  }

  function checkAlreadyCompleted() {
    const events = getEvents();
    const today = getTodayDateStr(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const done = events.some((e) => e.date === today && (e.type === "daily_refresh_completed" || e.type === "recovery_completed"));
    setCompleted(done);
  }

  function handleComplete() {
    const today = getTodayDateStr(Intl.DateTimeFormat().resolvedOptions().timeZone);
    addEvent({ type: "daily_refresh_completed", date: today, passageRef: passage.ref, reflection });
    setCompleted(true);
    refreshStreak();
  }

  function handleRecovery() {
    const tz2 = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const yesterday = new Date(new Date().getTime() - 86400000).toLocaleDateString("en-CA", { timeZone: tz2 });
    addEvent({ type: "recovery_completed", date: yesterday, passageRef: passage.ref });
    refreshStreak();
  }

  function handleListen() {
    if (!text) return;
    if (speaking) { speechSynthesis.cancel(); setSpeaking(false); return; }
    const utt = new SpeechSynthesisUtterance(text.verses.map((v) => v.text).join(" "));
    utt.rate = 0.9;
    utt.onend = () => setSpeaking(false);
    speechSynthesis.speak(utt);
    setSpeaking(true);
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-pulse text-sky-500">Loading today&apos;s refresh...</div></div>;
  }

  return (
    <div className="space-y-6">
      {streak && (
        <div className="flex items-center gap-3 text-sm flex-wrap">
          <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-semibold">
            🔥 {streak.currentStreak} day{streak.currentStreak !== 1 ? "s" : ""}
          </span>
          <span className="text-gray-500">{streak.totalCompleted} total readings</span>
          {streak.canRecover && !completed && (
            <button onClick={handleRecovery} className="ml-auto text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full hover:bg-amber-200 transition">
              Recover yesterday
            </button>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-sky-800">{passage.ref}</h2>
          <span className="text-xs text-gray-400">{dateStr}</span>
        </div>

        {text ? (
          <div className="space-y-2">
            {text.verses.map((v) => (
              <p key={v.verse} className="text-gray-700 leading-7">
                <sup className="text-xs text-sky-400 mr-1">{v.verse}</sup>
                {v.text}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-red-400 text-sm">Could not load passage. {error}</p>
        )}

        <button onClick={handleListen} className="text-sm text-sky-600 hover:text-sky-800 transition">
          {speaking ? "⏹ Stop listening" : "🔊 Listen"}
        </button>
      </div>

      {!completed ? (
        <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6 space-y-4">
          <h3 className="font-semibold text-sky-700">Reflect &amp; Respond</h3>
          <p className="text-sm text-gray-600 italic">{prompts[0]}</p>
          <p className="text-sm text-gray-600 italic">{prompts[1]}</p>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write your thoughts (optional)..."
            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none resize-none h-24"
          />
          <button
            onClick={handleComplete}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition shadow-sm"
          >
            Complete Today&apos;s Refresh ✓
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-2">
          <p className="text-green-700 font-semibold text-lg">Today&apos;s refresh complete!</p>
          <p className="text-sm text-green-600">Come back tomorrow to keep your streak going.</p>
        </div>
      )}
    </div>
  );
}
