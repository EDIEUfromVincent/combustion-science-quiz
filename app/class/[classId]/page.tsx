import { notFound } from "next/navigation";
import StudentLogin from "@/components/quiz/StudentLogin";

export default async function ClassLoginPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const classNo = Number(classId);
  if (!Number.isInteger(classNo) || classNo < 1 || classNo > 5) notFound();
  return <StudentLogin classNo={classNo} />;
}
