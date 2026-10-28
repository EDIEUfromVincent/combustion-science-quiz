import { NextResponse } from "next/server";
import { accessCodeMatches, setStudentSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { classNo?: number; studentNo?: number; name?: string; code?: string };
    const classNo = Number(body.classNo);
    const studentNo = Number(body.studentNo);
    const name = String(body.name || "").trim();
    const code = String(body.code || "").trim().toUpperCase();
    if (!Number.isInteger(classNo) || classNo < 1 || classNo > 5) return NextResponse.json({ error: "반을 다시 선택해 주세요." }, { status: 400 });
    if (!Number.isInteger(studentNo) || studentNo < 1 || studentNo > 50) return NextResponse.json({ error: "학생 번호를 1~50 사이로 입력해 주세요." }, { status: 400 });
    if (!/^[가-힣A-Za-z\s]{2,12}$/.test(name)) return NextResponse.json({ error: "이름을 2~12글자로 정확히 입력해 주세요." }, { status: 400 });
    if (!accessCodeMatches(classNo, code)) return NextResponse.json({ error: `${classNo}반 접속 코드가 맞지 않습니다.` }, { status: 401 });
    await setStudentSession({ classNo, studentNo, name });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "로그인 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요." }, { status: 500 }); }
}
