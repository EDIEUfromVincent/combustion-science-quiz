"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentLogin({ classNo }: { classNo: number }) {
  const router = useRouter();
  const [studentNo, setStudentNo] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch("/api/student/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ classNo, studentNo: Number(studentNo), name, code }) });
      const data = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok) throw new Error(data.error || "로그인하지 못했습니다.");
      router.push("/quiz");
    } catch (err) { setError(err instanceof Error ? err.message : "다시 시도해 주세요."); setLoading(false); }
  }

  return (
    <main className="shell flex min-h-screen items-center py-8">
      <section className="surface animate-rise mx-auto grid w-full max-w-4xl overflow-hidden rounded-[34px] lg:grid-cols-[.85fr_1.15fr]">
        <div className="relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-[#163437] p-8 text-white sm:p-10">
          <div><Link href="/" className="text-sm text-white/70 hover:text-white">← 반 선택으로</Link><div className="mt-10"><span className="text-6xl">🔥</span><p className="mt-5 text-sm font-bold tracking-[.15em] text-[#8ed9ca]">6학년 과학</p><h1 className="display mt-1 text-5xl">{classNo}반<br/>로그인</h1></div></div>
          <p className="mt-10 max-w-xs text-sm leading-6 text-white/65">시험 결과가 정확하게 기록되도록 자신의 번호와 이름을 입력하세요.</p>
          <span className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full border-[42px] border-white/5" />
        </div>
        <form onSubmit={submit} className="p-7 sm:p-10 lg:p-12">
          <span className="pill">학생 로그인</span>
          <h2 className="display mt-5 text-3xl">탐험대원 정보를 확인해요</h2>
          <p className="mt-2 text-sm leading-6 text-[#64797a]">입력한 이름과 번호로 시험 결과가 저장됩니다.</p>
          <div className="mt-8 grid gap-5">
            <label><span className="field-label">학생 번호</span><input className="field" type="number" min="1" max="50" required value={studentNo} onChange={(e) => setStudentNo(e.target.value)} placeholder="예: 12" inputMode="numeric" /></label>
            <label><span className="field-label">이름</span><input className="field" required maxLength={12} value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 김과학" autoComplete="name" /></label>
            <label><span className="field-label">{classNo}반 접속 코드</span><input className="field uppercase" required maxLength={16} value={code} onChange={(e) => setCode(e.target.value)} placeholder="선생님이 알려 준 코드" autoComplete="one-time-code" /></label>
            {error && <div className="error-box" role="alert">⚠️ {error}</div>}
            <button className="primary mt-2 w-full" type="submit" disabled={loading}>{loading ? "확인하는 중…" : "시험장 입장하기 →"}</button>
          </div>
          <p className="mt-5 text-center text-xs text-[#879996]">개인정보는 시험 결과 확인 목적으로만 저장됩니다.</p>
        </form>
      </section>
    </main>
  );
}
