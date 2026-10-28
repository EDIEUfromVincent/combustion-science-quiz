import TeacherDashboard from "@/components/quiz/TeacherDashboard";
import TeacherLogin from "@/components/quiz/TeacherLogin";
import { getTeacherSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function TeacherPage() {
  if (!await getTeacherSession()) return <TeacherLogin />;
  return <TeacherDashboard teacherName={process.env.TEACHER_NAME || "담당"} />;
}
