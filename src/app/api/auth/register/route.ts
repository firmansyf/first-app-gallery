import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Registration is disabled. This is a private gallery." },
    { status: 403 }
  );
}
