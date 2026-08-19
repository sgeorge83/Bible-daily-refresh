import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Simple guest-mode: create or get user by id stored in localStorage */
export async function POST(req: NextRequest) {
  const { id, timezone, reminderTime } = await req.json();

  const user = await prisma.user.upsert({
    where: { id: id || "___none___" },
    update: { timezone, reminderTime },
    create: { timezone: timezone || "UTC", reminderTime: reminderTime || "08:00" },
  });

  return NextResponse.json(user);
}
