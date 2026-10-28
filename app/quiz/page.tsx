import { redirect } from "next/navigation";
import QuizClient from "@/components/quiz/QuizClient";
import { getStudentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const student = await getStudentSession();
  if (!student) redirect("/");
  return <QuizClient student={{ classNo: student.classNo, studentNo: student.studentNo, name: student.name }} />;
}
