import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const friendships = await prisma.friendship.findMany({
    where: { userId },
    include: { friend: { select: { id: true, name: true } } },
  });

  const friendIds = friendships.map((f) => f.friendId);

  // Get friends' latest completion events
  const friendEvents = friendIds.length
    ? await prisma.refreshEvent.findMany({
        where: { userId: { in: friendIds }, type: "daily_refresh_completed" },
        orderBy: { date: "desc" },
        take: friendIds.length,
        distinct: ["userId"],
      })
    : [];

  const friends = friendships.map((f) => {
    const lastEvent = friendEvents.find((e) => e.userId === f.friendId);
    return { id: f.friendId, name: f.friend.name, lastCompleted: lastEvent?.date ?? null };
  });

  return NextResponse.json({ friends });
}

export async function POST(req: NextRequest) {
  const { userId, friendId } = await req.json();
  if (!userId || !friendId) return NextResponse.json({ error: "userId and friendId required" }, { status: 400 });
  if (userId === friendId) return NextResponse.json({ error: "Cannot add yourself" }, { status: 400 });

  const friendship = await prisma.friendship.upsert({
    where: { userId_friendId: { userId, friendId } },
    update: {},
    create: { userId, friendId },
  });

  return NextResponse.json({ ok: true, friendship });
}
