import { NextResponse } from "next/server";
import { setTeacherSession, teacherPasswordMatches } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { password?: string };
    if (!teacherPasswordMatches(String(body.password || ""))) {
      return NextResponse.json({ error: "교사 비밀번호가 맞지 않습니다." }, { status: 401 });
    }
    await setTeacherSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "로그인 중 문제가 생겼습니다." }, { status: 500 });
  }
}
