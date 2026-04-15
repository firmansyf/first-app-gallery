import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Public: send a message
export async function POST(req: NextRequest) {
  try {
    const { name, text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const senderName = name?.trim() || "Anonymous";

    const message = await prisma.message.create({
      data: {
        name: senderName,
        text: text.trim(),
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Message send error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// Admin: get all messages
export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = await prisma.message.count({
    where: { read: false },
  });

  return NextResponse.json({ messages, unreadCount });
}
