import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTodayDateStr } from "@/lib/daily-passages";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, passageRef, reflection, isRecovery } = body;

  if (!userId || !passageRef) {
    return NextResponse.json({ error: "userId and passageRef required" }, { status: 400 });
  }

  const tz = body.tz || "UTC";
  const date = isRecovery
    ? new Date(new Date().getTime() - 86400000).toLocaleDateString("en-CA", { timeZone: tz })
    : getTodayDateStr(tz);

  const type = isRecovery ? "recovery_completed" : "daily_refresh_completed";

  const event = await prisma.refreshEvent.create({
    data: { userId, type, date, passageRef, reflection: reflection || null },
  });

  return NextResponse.json({ ok: true, event });
}
