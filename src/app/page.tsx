"use client";

import { useEffect, useState } from "react";

interface DailyData {
  date: string;
  passage: { ref: string };
  text: { reference: string; verses: { verse: number; text: string }[]; translation_name: string } | null;
  prompts: [string, string];
  error?: string;
}

export default function DailyPage() {
  const [data, setData] = useState<DailyData | null>(null);
  const [reflection, setReflection] = useState("");
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    let uid = localStorage.getItem("dr_userId");
    if (!uid) {
      uid = crypto.randomUUID();
      localStorage.setItem("dr_userId", uid);
      fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
      }).then((r) => r.json()).then((u) => localStorage.setItem("dr_userId", u.id));
    }
    setUserId(uid);
  }, []);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch(`/api/daily?tz=${encodeURIComponent(tz)}`)
      .then((r) => r.json())
      .then(setData);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch(`/api/streak?userId=${userId}&tz=${encodeURIComponent(tz)}`)
      .then((r) => r.json())
      .then(setStreak);
  }, [userId, completed]);

  async function handleComplete() {
    if (!userId || !data) return;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await fetch("/api/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, passageRef: data.passage.ref, reflection, tz }),
    });
    setCompleted(true);
  }

  async function handleRecovery() {
    if (!userId || !data) return;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await fetch("/api/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, passageRef: data.passage.ref, reflection: "", tz, isRecovery: true }),
    });
    setCompleted(true);
  }

  function handleListen() {
    if (!data?.text) return;
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utt = new SpeechSynthesisUtterance(data.text.verses.map((v) => v.text).join(" "));
    utt.rate = 0.9;
    utt.onend = () => setSpeaking(false);
    speechSynthesis.speak(utt);
    setSpeaking(true);
  }

  if (!data) {
    return <div className="flex items-center justify-center py-20"><div className="animate-pulse text-sky-500">Loading today&apos;s refresh...</div></div>;
  }

  return (
    <div className="space-y-6">
      {/* Streak banner */}
      {streak && (
        <div className="flex items-center gap-3 text-sm">
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

      {/* Daily card */}
      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-sky-800">{data.passage.ref}</h2>
          <span className="text-xs text-gray-400">{data.date}</span>
        </div>

        {data.text ? (
          <div className="space-y-2">
            {data.text.verses.map((v) => (
              <p key={v.verse} className="text-gray-700 leading-7">
                <sup className="text-xs text-sky-400 mr-1">{v.verse}</sup>
                {v.text}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-red-400 text-sm">Could not load passage. {data.error}</p>
        )}

        <button onClick={handleListen} className="text-sm text-sky-600 hover:text-sky-800 transition">
          {speaking ? "⏹ Stop listening" : "🔊 Listen"}
        </button>
      </div>

      {/* Reflection */}
      {!completed ? (
        <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6 space-y-4">
          <h3 className="font-semibold text-sky-700">Reflect &amp; Respond</h3>
          <p className="text-sm text-gray-600 italic">{data.prompts[0]}</p>
          <p className="text-sm text-gray-600 italic">{data.prompts[1]}</p>
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
