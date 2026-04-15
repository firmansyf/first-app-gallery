import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Admin: mark as read, reply, or delete
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const data: { read?: boolean; reply?: string } = {};
  if (body.read !== undefined) data.read = body.read;
  if (body.reply !== undefined) data.reply = body.reply;

  const message = await prisma.message.update({
    where: { id },
    data,
  });

  return NextResponse.json({ message });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.message.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
