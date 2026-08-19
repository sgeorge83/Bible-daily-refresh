import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { computeStreak } from "@/lib/streak-engine";
import { getTodayDateStr } from "@/lib/daily-passages";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const tz = req.nextUrl.searchParams.get("tz") || "UTC";

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const events = await prisma.refreshEvent.findMany({
    where: { userId },
    orderBy: { date: "asc" },
    select: { type: true, date: true },
  });

  const todayStr = getTodayDateStr(tz);
  const streak = computeStreak(events as any, todayStr);

  return NextResponse.json(streak);
}
