import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { getStudentSession } from "@/lib/session";
import { isQuestionCorrect, questions } from "@/lib/questions";

export async function POST(request: Request) {
  const student = await getStudentSession();
  if (!student) return NextResponse.json({ error: "로그인 정보가 만료되었습니다." }, { status: 401 });

  try {
    const body = await request.json() as { durationSeconds?: number; answers?: Array<{ questionId?: number; answer?: unknown }> };
    const durationSeconds = Number(body.durationSeconds);
    if (!Array.isArray(body.answers) || body.answers.length !== questions.length || !Number.isFinite(durationSeconds)) {
      return NextResponse.json({ error: "제출 데이터가 올바르지 않습니다." }, { status: 400 });
    }

    const sanitizedAnswers = questions.map((question, index) => {
      const raw = body.answers?.[index]?.questionId === question.id ? body.answers[index].answer : null;
      return { questionId: question.id, answer: typeof raw === "string" || typeof raw === "number" ? raw : null };
    });
    const correctCount = questions.filter((question, index) => isQuestionCorrect(question, sanitizedAnswers[index].answer)).length;
    const totalCount = questions.length;
    const score = Math.round(correctCount / totalCount * 100);
    const categoryData = [...new Set(questions.map((question) => question.category))].map((category) => {
      const indexes = questions.map((question, index) => question.category === category ? index : -1).filter((index) => index >= 0);
      return { category, correct: indexes.filter((index) => isQuestionCorrect(questions[index], sanitizedAnswers[index].answer)).length, total: indexes.length };
    });
    const answerData = sanitizedAnswers.map((item, index) => ({ ...item, correct: isQuestionCorrect(questions[index], item.answer) }));

    await ensureSchema();
    const sql = db();
    const attemptNo = await sql.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(${student.classNo}, ${student.studentNo})`;
      const [row] = await tx<{ value: number }[]>`
        SELECT COUNT(*)::int AS value FROM quiz_results
        WHERE class_no = ${student.classNo} AND student_no = ${student.studentNo}
      `;
      const nextAttempt = row.value + 1;
      await tx`
        INSERT INTO quiz_results (
          class_no, student_no, student_name, score, correct_count, total_count,
          duration_seconds, attempt_no, category_json, answers_json, submitted_at
        ) VALUES (
          ${student.classNo}, ${student.studentNo}, ${student.name}, ${score}, ${correctCount}, ${totalCount},
          ${Math.max(0, Math.min(3600, Math.round(durationSeconds)))}, ${nextAttempt},
          ${sql.json(categoryData)}, ${sql.json(answerData)}, NOW()
        )
      `;
      return nextAttempt;
    });
    return NextResponse.json({ ok: true, attemptNo });
  } catch (error) {
    console.error("result submission failed", error);
    return NextResponse.json({ error: "점수 저장 중 문제가 생겼습니다." }, { status: 500 });
  }
}
