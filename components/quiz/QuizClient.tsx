"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { questions, isQuestionCorrect } from "@/lib/questions";

type Student = { classNo: number; studentNo: number; name: string };
type Submission = { status: "idle" | "sending" | "done" | "error"; attemptNo?: number; message?: string };

export default function QuizClient({ student }: { student: Student }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | string | null)[]>(Array(questions.length).fill(null));
  const [checked, setChecked] = useState<boolean[]>(Array(questions.length).fill(false));
  const [flags, setFlags] = useState<number[]>([]);
  const [remaining, setRemaining] = useState(600);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<"hint" | "result" | null>(null);
  const [submission, setSubmission] = useState<Submission>({ status: "idle" });
  const startedAt = useRef(Date.now());
  const submitted = useRef(false);
  const q = questions[current];

  const correctCount = useMemo(() => questions.filter((question, index) => isQuestionCorrect(question, answers[index])).length, [answers]);
  const score = Math.round(correctCount / questions.length * 100);

  useEffect(() => {
    if (finished) return;
    const timer = window.setInterval(() => setRemaining((value) => {
      if (value <= 1) { window.clearInterval(timer); setFinished(true); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [finished]);

  useEffect(() => {
    if (finished && !submitted.current) void submitResult();
    // submitResult intentionally runs only when the quiz first reaches its finished state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  function choose(answer: number | string) {
    if (checked[current]) return;
    setAnswers((items) => items.map((item, index) => index === current ? answer : item));
    setFeedback(null);
  }

  function checkAnswer() {
    if (answers[current] === null || String(answers[current]).trim() === "") return;
    setChecked((items) => items.map((item, index) => index === current ? true : item));
    setFeedback("result");
  }

  function next() {
    if (current === questions.length - 1) { setFinished(true); return; }
    setCurrent((value) => value + 1); setFeedback(null);
  }

  async function submitResult(force = false) {
    if (submitted.current && !force) return;
    submitted.current = true; setSubmission({ status: "sending" });
    const categories = [...new Set(questions.map((question) => question.category))].map((category) => {
      const indexes = questions.map((question, index) => question.category === category ? index : -1).filter((index) => index >= 0);
      return { category, correct: indexes.filter((index) => isQuestionCorrect(questions[index], answers[index])).length, total: indexes.length };
    });
    const body = { score, correctCount, totalCount: questions.length, durationSeconds: Math.min(600, Math.round((Date.now() - startedAt.current) / 1000)), categories, answers: questions.map((question, index) => ({ questionId: question.id, answer: answers[index], correct: isQuestionCorrect(question, answers[index]) })) };
    try {
      const response = await fetch("/api/results", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json() as { attemptNo?: number; error?: string };
      if (!response.ok) throw new Error(data.error || "제출하지 못했습니다.");
      setSubmission({ status: "done", attemptNo: data.attemptNo });
    } catch (error) { submitted.current = false; setSubmission({ status: "error", message: error instanceof Error ? error.message : "제출하지 못했습니다." }); }
  }

  if (finished) return <ResultView student={student} answers={answers} score={score} correctCount={correctCount} submission={submission} retrySubmit={() => submitResult(true)} onLogout={async () => { await fetch("/api/student/logout", { method: "POST" }); router.push(`/class/${student.classNo}`); }} />;

  const answerSelected = answers[current] !== null && String(answers[current]).trim() !== "";
  const correct = isQuestionCorrect(q, answers[current]);
  return (
    <main className="shell min-h-screen py-5 sm:py-8">
      <header className="flex items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#163437]">🔥</span><div><b className="display">연소 탐험대</b><small className="block text-[11px] text-[#64797a]">6학년 {student.classNo}반 {student.studentNo}번 {student.name}</small></div></div>
        <div className={`rounded-full border bg-white px-4 py-2 font-bold ${remaining <= 60 ? "border-[#d84f45] text-[#d84f45]" : "border-[#d6e3df]"}`}>⏱ {String(Math.floor(remaining / 60)).padStart(2,"0")}:{String(remaining % 60).padStart(2,"0")}</div>
      </header>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#dce9e5]"><span className="block h-full rounded-full bg-[#2ea69f] transition-all" style={{ width: `${(current + 1) / questions.length * 100}%` }} /></div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
        <section className="surface min-h-[620px] rounded-[28px] p-5 sm:p-9 lg:p-12">
          <div className="flex items-center justify-between"><span className="text-xs font-extrabold tracking-[.14em] text-[#ef7655]">{q.type === "short" ? "단답형" : q.type === "boolean" ? "OX 문제" : "객관식"}</span><button className={`text-xs font-bold ${flags.includes(current) ? "text-[#b47b00]" : "text-[#64797a]"}`} onClick={() => setFlags((items) => items.includes(current) ? items.filter((item) => item !== current) : [...items, current])}>{flags.includes(current) ? "★ 표시됨" : "☆ 나중에 보기"}</button></div>
          <div className="mt-8"><span className="pill">{q.category}</span><h1 className="display mt-4 break-keep text-[clamp(1.7rem,4vw,2.7rem)] leading-[1.35]">{q.question}</h1><p className="mt-3 leading-7 text-[#64797a]">{q.context}</p></div>

          <div className={`mt-8 grid gap-3 ${q.type === "boolean" ? "sm:grid-cols-2" : ""}`}>
            {q.type === "short" ? <input className="field bg-[#fff9ed] text-lg" placeholder="정답을 입력하세요" disabled={checked[current]} value={String(answers[current] ?? "")} onChange={(event) => choose(event.target.value)} /> : q.options?.map((option, index) => {
              const selected = answers[current] === index;
              const correctOption = checked[current] && q.answer === index;
              const wrongOption = checked[current] && selected && !correctOption;
              return <button key={option} disabled={checked[current]} onClick={() => choose(index)} className={`flex min-h-[64px] items-center gap-3 rounded-2xl border p-3 text-left transition ${correctOption ? "border-[#39a86b] bg-[#eaf8ed]" : wrongOption ? "border-[#dc6a61] bg-[#fff0ee]" : selected ? "border-2 border-[#2ea69f] bg-[#eaf8f3]" : "border-[#d6e3df] bg-white hover:border-[#2ea69f]"}`}><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e8f2ef] font-extrabold text-[#176b68]">{q.type === "boolean" ? (index === 0 ? "O" : "X") : String.fromCharCode(65 + index)}</span><span className="break-keep leading-6">{option}</span></button>;
            })}
          </div>

          {feedback === "hint" && <div className="mt-4 rounded-2xl bg-[#fff8df] p-4 text-sm leading-6 text-[#755b18]"><b>💡 생각 열기</b><br/>{q.hint}</div>}
          {feedback === "result" && <div className={`mt-4 rounded-2xl p-4 text-sm leading-6 ${correct ? "bg-[#eaf8ed] text-[#286943]" : "bg-[#fff0ee] text-[#8b403a]"}`}><b>{correct ? "✓ 정확해요!" : "✕ 개념을 확인해 볼까요?"}</b><br/>{q.explanation}</div>}

          <div className="mt-8 flex items-center gap-3"><button className="secondary" onClick={() => setFeedback("hint")}>💡 힌트</button>{!checked[current] ? <button className="primary ml-auto" disabled={!answerSelected} onClick={checkAnswer}>정답 확인</button> : <button className="primary ml-auto" onClick={next}>{current === questions.length - 1 ? "시험 제출하기 →" : "다음 문제 →"}</button>}</div>
        </section>

        <aside className="surface order-first h-fit rounded-[24px] p-4 lg:order-none lg:sticky lg:top-5">
          <div className="mb-3 flex items-center justify-between"><b>문제 지도</b><small className="text-[#64797a]">{current + 1} / {questions.length}</small></div>
          <div className="grid grid-cols-12 gap-2 overflow-x-auto pb-1 lg:grid-cols-4">{questions.map((question, index) => <button key={question.id} onClick={() => { setCurrent(index); setFeedback(checked[index] ? "result" : null); }} className={`relative h-10 min-w-10 rounded-xl font-extrabold ${index === current ? "bg-[#163437] text-white" : answers[index] !== null ? "bg-[#dff4ed] text-[#176b68]" : "bg-[#edf2ef] text-[#71827d]"}`}>{index + 1}{flags.includes(index) && <i className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#f8c955]" />}</button>)}</div>
        </aside>
      </div>
    </main>
  );
}

function ResultView({ student, answers, score, correctCount, submission, retrySubmit, onLogout }: { student: Student; answers: (number|string|null)[]; score: number; correctCount: number; submission: Submission; retrySubmit: () => void; onLogout: () => Promise<void> }) {
  const wrongs = questions.map((question, index) => ({ question, index })).filter(({ question, index }) => !isQuestionCorrect(question, answers[index]));
  return <main className="shell py-6 sm:py-9">
    <section className="surface overflow-hidden rounded-[34px]">
      <div className="grid gap-8 bg-[#163437] p-7 text-white sm:p-11 lg:grid-cols-[220px_1fr] lg:items-center">
        <div className="mx-auto grid h-48 w-48 place-items-center rounded-full border-[13px] border-[#f8c955]"><div className="text-center"><b className="display text-6xl">{score}</b><small className="block text-white/60">점</small></div></div>
        <div><span className="text-xs font-bold tracking-[.16em] text-[#8ed9ca]">MISSION COMPLETE</span><h1 className="display mt-2 text-5xl">탐험 완료!</h1><p className="mt-3 text-white/70">6학년 {student.classNo}반 {student.studentNo}번 {student.name} · {correctCount}/{questions.length}문항 정답</p>
          <div className="mt-5">{submission.status === "sending" && <div className="rounded-xl bg-white/10 p-3 text-sm">⏳ 선생님께 점수를 제출하는 중입니다…</div>}{submission.status === "done" && <div className="rounded-xl bg-[#2ea69f]/25 p-3 text-sm font-bold">✓ 점수가 자동 제출되었습니다. (제{submission.attemptNo}회 응시)</div>}{submission.status === "error" && <div className="rounded-xl bg-[#d84f45]/25 p-3 text-sm">⚠️ {submission.message} <button className="ml-2 underline" onClick={retrySubmit}>다시 제출</button></div>}</div>
        </div>
      </div>
      <div className="p-6 sm:p-10"><div className="flex items-end justify-between border-b border-[#d6e3df] pb-4"><div><span className="text-xs font-extrabold tracking-[.13em] text-[#176b68]">오답 노트</span><h2 className="display mt-1 text-2xl">한 번 더 살펴봐요</h2></div><span className="text-sm text-[#64797a]">오답 {wrongs.length}개</span></div>
        {wrongs.length === 0 ? <p className="py-10 text-center font-bold text-[#176b68]">🎉 모든 문제를 맞혔어요!</p> : <div>{wrongs.map(({ question, index }) => <article key={question.id} className="grid grid-cols-[38px_1fr] gap-3 border-b border-[#e5ece9] py-5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#fff0ee] font-bold text-[#d84f45]">{index + 1}</span><div><h3 className="font-bold leading-6">{question.question}</h3><p className="mt-1 text-sm leading-6 text-[#64797a]">{question.explanation}</p></div></article>)}</div>}
        <div className="mt-8 flex flex-wrap justify-center gap-3"><button className="secondary" onClick={onLogout}>로그아웃</button><button className="primary" onClick={() => window.location.reload()}>다시 도전하기 ↻</button></div>
      </div>
    </section>
  </main>;
}
