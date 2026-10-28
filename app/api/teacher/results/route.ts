import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { getTeacherSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!await getTeacherSession()) return NextResponse.json({ error: "교사 권한이 없습니다." }, { status: 403 });
  try {
    await ensureSchema();
    const results = await db()`
      SELECT
        id::int AS id,
        class_no AS "classNo",
        student_no AS "studentNo",
        student_name AS "studentName",
        score,
        correct_count AS "correctCount",
        total_count AS "totalCount",
        duration_seconds AS "durationSeconds",
        attempt_no AS "attemptNo",
        category_json::text AS "categoryJson",
        answers_json::text AS "answersJson",
        submitted_at AS "submittedAt"
      FROM quiz_results
      ORDER BY submitted_at DESC
      LIMIT 1000
    `;
    return NextResponse.json({ results }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("teacher results failed", error);
    return NextResponse.json({ error: "결과를 불러오지 못했습니다." }, { status: 500 });
  }
}
