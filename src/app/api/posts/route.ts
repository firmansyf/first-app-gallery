import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor");
    const take = 20;

    const posts = await prisma.post.findMany({
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json({
      posts,
      nextCursor: posts.length === take ? posts[posts.length - 1].id : null,
    });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ posts: [], nextCursor: null }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content, mediaUrl, mediaType, latitude, longitude, location } = await req.json();

  if (!content && !mediaUrl) {
    return NextResponse.json({ error: "Post must have content or media" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      content,
      mediaUrl,
      mediaType,
      latitude,
      longitude,
      location,
      userId: session.userId,
    },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
