import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSchema();
    await db()`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("healthcheck database connection failed", error);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
