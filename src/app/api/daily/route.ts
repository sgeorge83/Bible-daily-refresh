import { NextRequest, NextResponse } from "next/server";
import { getTodayPassage, getTodayDateStr, dayOfYear } from "@/lib/daily-passages";
import { getPromptsForDay } from "@/lib/reflection-prompts";
import { fetchPassage } from "@/lib/text-provider";

export async function GET(req: NextRequest) {
  const tz = req.nextUrl.searchParams.get("tz") || "UTC";
  const passage = getTodayPassage(tz);
  const dateStr = getTodayDateStr(tz);
  const doy = dayOfYear(dateStr);
  const prompts = getPromptsForDay(doy);

  try {
    const text = await fetchPassage(passage.ref);
    return NextResponse.json({ date: dateStr, passage, text, prompts });
  } catch (e: any) {
    return NextResponse.json({ date: dateStr, passage, text: null, prompts, error: e.message }, { status: 502 });
  }
}
