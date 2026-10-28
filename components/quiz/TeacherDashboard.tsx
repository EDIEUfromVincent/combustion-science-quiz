"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Result = { id:number; classNo:number; studentNo:number; studentName:string; score:number; correctCount:number; totalCount:number; durationSeconds:number; attemptNo:number; categoryJson:string; answersJson:string; submittedAt:string };

export default function TeacherDashboard({ teacherName }: { teacherName: string }) {
  const [results, setResults] = useState<Result[]>([]);
  const [classFilter, setClassFilter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function load() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/teacher/results", { cache: "no-store" });
      const data = await response.json() as { results?: Result[]; error?: string };
      if (!response.ok) throw new Error(data.error || "결과를 불러오지 못했습니다.");
      setResults(data.results || []);
    } catch (err) { setError(err instanceof Error ? err.message : "결과를 불러오지 못했습니다."); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const filtered = useMemo(() => classFilter ? results.filter((result) => result.classNo === classFilter) : results, [results, classFilter]);
  const latest = useMemo(() => {
    const map = new Map<string, Result>();
    filtered.forEach((result) => { const key = `${result.classNo}-${result.studentNo}`; if (!map.has(key)) map.set(key, result); });
    return [...map.values()].sort((a,b) => a.classNo - b.classNo || a.studentNo - b.studentNo);
  }, [filtered]);
  const average = latest.length ? Math.round(latest.reduce((sum, item) => sum + item.score, 0) / latest.length) : 0;
  const perfect = latest.filter((item) => item.score === 100).length;

  function downloadCsv() {
    const header = ["학년","반","번호","이름","점수","정답수","전체문항","응시회차","소요시간(초)","제출시각"];
    const rows = filtered.map((item) => [6,item.classNo,item.studentNo,item.studentName,item.score,item.correctCount,item.totalCount,item.attemptNo,item.durationSeconds,new Date(item.submittedAt).toLocaleString("ko-KR")]);
    const csv = "\ufeff" + [header,...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"','""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `6학년_${classFilter ? `${classFilter}반_` : ""}과학시험결과.csv`; link.click(); URL.revokeObjectURL(url);
  }

  async function copySummary() {
    const label = classFilter ? `6학년 ${classFilter}반` : "6학년 전체";
    const lines = [`[${label} 연소 단원 시험 결과]`, `응시 학생 ${latest.length}명 · 평균 ${average}점 · 100점 ${perfect}명`, ...latest.map((item) => `${item.classNo}반 ${item.studentNo}번 ${item.studentName}: ${item.score}점 (${item.attemptNo}회 응시)`)];
    await navigator.clipboard.writeText(lines.join("\n")); setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  }

  return <main className="shell py-5 sm:py-8">
    <header className="no-print flex flex-wrap items-center justify-between gap-3 py-3"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#163437] text-xl">📊</span><div><b className="display text-xl">교사용 결과 센터</b><small className="block text-[11px] text-[#64797a]">{teacherName} 선생님</small></div></div><div className="flex gap-2"><Link className="secondary flex items-center" href="/">학생 화면</Link><button className="secondary" onClick={() => window.print()}>인쇄</button><button className="secondary" onClick={async () => { await fetch("/api/teacher/logout", { method: "POST" }); window.location.reload(); }}>로그아웃</button></div></header>

    <section className="surface mt-5 rounded-[30px] p-5 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><span className="pill">LIVE RESULTS</span><h1 className="display mt-3 text-3xl sm:text-4xl">학생 결과가 자동으로 모입니다</h1><p className="mt-2 text-sm text-[#64797a]">학생별 최신 결과를 보여 주며, 모든 응시 기록은 CSV에 포함됩니다.</p></div><button className="secondary no-print" onClick={load}>↻ 새로고침</button></div>
      <div className="no-print mt-7 flex flex-wrap gap-2">{[0,1,2,3,4,5].map((classNo) => <button key={classNo} onClick={() => setClassFilter(classNo)} className={`rounded-full px-4 py-2 text-sm font-bold ${classFilter === classNo ? "bg-[#163437] text-white" : "bg-[#edf3f0] text-[#64797a]"}`}>{classNo === 0 ? "전체" : `${classNo}반`}</button>)}</div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Stat label="응시 학생" value={`${latest.length}명`} icon="👥"/><Stat label="평균 점수" value={`${average}점`} icon="📈"/><Stat label="전체 제출" value={`${filtered.length}건`} icon="📨"/><Stat label="100점" value={`${perfect}명`} icon="🏅"/></div>
    </section>

    <section className="surface mt-5 overflow-hidden rounded-[30px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d6e3df] p-5 sm:px-8"><div><b className="display text-xl">학생별 최신 결과</b><small className="ml-2 text-[#64797a]">번호순</small></div><div className="no-print flex gap-2"><button className="secondary" disabled={!latest.length} onClick={copySummary}>{copied ? "✓ 복사됨" : "요약 복사"}</button><button className="primary" disabled={!filtered.length} onClick={downloadCsv}>CSV 다운로드 ↓</button></div></div>
      {loading ? <div className="p-16 text-center text-[#64797a]">결과를 불러오는 중…</div> : error ? <div className="m-6 error-box">{error}</div> : !latest.length ? <div className="p-16 text-center"><span className="text-4xl">🧪</span><h2 className="display mt-3 text-xl">아직 제출된 결과가 없습니다</h2><p className="mt-2 text-sm text-[#64797a]">학생이 시험을 마치면 여기에 자동으로 표시됩니다.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left"><thead><tr className="bg-[#f4f8f6] text-xs text-[#64797a]"><th className="px-6 py-4">학생</th><th className="px-4 py-4">최신 점수</th><th className="px-4 py-4">정답</th><th className="px-4 py-4">응시</th><th className="px-4 py-4">소요 시간</th><th className="px-6 py-4">최근 제출</th></tr></thead><tbody>{latest.map((item) => <tr key={`${item.classNo}-${item.studentNo}`} className="border-t border-[#e5ece9]"><td className="px-6 py-4"><b>{item.classNo}반 {item.studentNo}번</b><small className="ml-2 text-[#64797a]">{item.studentName}</small></td><td className="px-4 py-4"><div className="flex items-center gap-3"><b className={`text-lg ${item.score >= 80 ? "text-[#176b68]" : item.score >= 60 ? "text-[#b47b00]" : "text-[#d84f45]"}`}>{item.score}</b><div className="h-2 w-20 overflow-hidden rounded-full bg-[#e4ece8]"><span className="block h-full bg-[#2ea69f]" style={{width:`${item.score}%`}}/></div></div></td><td className="px-4 py-4">{item.correctCount}/{item.totalCount}</td><td className="px-4 py-4">{item.attemptNo}회</td><td className="px-4 py-4">{Math.floor(item.durationSeconds/60)}분 {item.durationSeconds%60}초</td><td className="px-6 py-4 text-sm text-[#64797a]">{new Date(item.submittedAt).toLocaleString("ko-KR")}</td></tr>)}</tbody></table></div>}
    </section>
  </main>;
}

function Stat({ label, value, icon }: { label:string; value:string; icon:string }) { return <article className="rounded-2xl border border-[#d6e3df] bg-white p-5"><div className="flex items-center justify-between"><span className="text-sm text-[#64797a]">{label}</span><span>{icon}</span></div><b className="display mt-2 block text-3xl">{value}</b></article>; }
