"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function TeacherLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/teacher/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "로그인하지 못했습니다.");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "다시 시도해 주세요.");
      setLoading(false);
    }
  }

  return <main className="shell flex min-h-screen items-center py-10">
    <section className="surface mx-auto w-full max-w-lg rounded-[30px] p-8 sm:p-10">
      <span className="text-5xl">🔒</span>
      <span className="pill mt-6 w-fit">TEACHER ONLY</span>
      <h1 className="display mt-4 text-4xl">교사용 페이지</h1>
      <p className="mt-3 leading-7 text-[#64797a]">학생 결과는 교사 비밀번호를 확인한 뒤에만 볼 수 있습니다.</p>
      <form className="mt-8 grid gap-4" onSubmit={submit}>
        <label><span className="field-label">교사 비밀번호</span><input className="field" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>
        {error && <div className="error-box" role="alert">⚠️ {error}</div>}
        <button className="primary" type="submit" disabled={loading}>{loading ? "확인하는 중…" : "교사용 페이지 열기 →"}</button>
      </form>
      <Link className="secondary mt-4 flex justify-center" href="/">학생 화면으로</Link>
    </section>
  </main>;
}
