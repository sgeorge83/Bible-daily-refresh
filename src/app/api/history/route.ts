import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const events = await prisma.refreshEvent.findMany({
    where: { userId, type: { in: ["daily_refresh_completed", "recovery_completed"] } },
    orderBy: { date: "desc" },
    take: 60,
  });

  return NextResponse.json({ events });
}
