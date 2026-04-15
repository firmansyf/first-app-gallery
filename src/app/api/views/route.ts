import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Only count one view per IP per post per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existing = await prisma.view.findFirst({
      where: {
        postId,
        ipAddress,
        viewedAt: { gte: oneHourAgo },
      },
    });

    if (existing) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    await prisma.view.create({
      data: {
        postId,
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postId = req.nextUrl.searchParams.get("postId");

  if (postId) {
    const views = await prisma.view.findMany({
      where: { postId },
      orderBy: { viewedAt: "desc" },
      take: 100,
    });

    const total = await prisma.view.count({ where: { postId } });

    return NextResponse.json({ views, total });
  }

  // Summary: total views per post
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      mediaUrl: true,
      mediaType: true,
      createdAt: true,
      _count: { select: { views: true } },
    },
  });

  const totalViews = await prisma.view.count();

  return NextResponse.json({ posts, totalViews });
}
