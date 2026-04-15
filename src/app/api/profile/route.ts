import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

export async function PUT(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const name = formData.get("name") as string | null;
  const avatar = formData.get("avatar") as File | null;

  const data: { name?: string; avatar?: string } = {};

  if (name && name.trim()) {
    data.name = name.trim();
  }

  if (avatar && avatar.size > 0) {
    const bytes = await avatar.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(avatar.name) || ".jpg";
    const filename = `avatar-${uuid()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    data.avatar = `/uploads/${filename}`;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.userId },
    data,
    select: { id: true, username: true, name: true, avatar: true },
  });

  return NextResponse.json({ user });
}
