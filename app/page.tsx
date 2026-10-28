const classes = [1, 2, 3, 4, 5];

export default function Home() {
  return (
    <main className="shell py-5 sm:py-9">
      <header className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#163437] text-xl">🔥</span><div><b className="display text-xl">연소 탐험대</b><small className="block text-[11px] text-[#64797a]">6학년 과학 개념 시험</small></div></div>
        <a className="secondary no-print flex items-center" href="/teacher">교사용 페이지 →</a>
      </header>

      <section className="surface animate-rise mt-6 overflow-hidden rounded-[34px] p-6 sm:p-10 lg:p-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="pill">SCIENCE CHECK · 물질의 연소</span>
            <h1 className="display mt-5 break-keep text-[clamp(3rem,6vw,4.6rem)] leading-[1.04]">우리 반을 선택하고<br/><span className="text-[#ef7655]">탐험을 시작해요!</span></h1>
            <p className="mt-6 max-w-xl leading-8 text-[#64797a]">반별 로그인 후 시험을 마치면 점수가 선생님에게 자동으로 제출됩니다. 자신의 반·번호·이름을 정확히 입력해 주세요.</p>
          </div>
          <div className="relative mx-auto grid aspect-square w-full max-w-[430px] place-items-center rounded-full border border-dashed border-[#2ea69f]/35 bg-[#dff4ed]/60">
            <div className="grid h-52 w-52 place-items-center rounded-[48%_48%_35%_35%] bg-white text-center shadow-[0_22px_55px_rgba(22,52,55,.15)]"><div><span className="text-6xl">🔥</span><p className="mt-3 text-sm text-[#64797a]">오늘의 미션</p><b className="display text-2xl">연소 정복</b></div></div>
            <span className="absolute left-0 top-16 rotate-[-7deg] rounded-2xl bg-white px-5 py-4 font-bold shadow-lg">🪵 탈 물질</span>
            <span className="absolute right-0 top-24 rotate-[5deg] rounded-2xl bg-white px-5 py-4 font-bold shadow-lg">O₂ 산소</span>
            <span className="absolute bottom-8 right-10 rotate-[-4deg] rounded-2xl bg-white px-5 py-4 font-bold shadow-lg">🌡️ 발화점</span>
          </div>
        </div>

        <div className="mt-12 border-t border-[#d6e3df] pt-8">
          <div className="mb-5 flex items-end justify-between"><div><span className="text-xs font-extrabold tracking-[.16em] text-[#176b68]">CLASS LOGIN</span><h2 className="display mt-1 text-2xl">나는 몇 반인가요?</h2></div><small className="hidden text-[#64797a] sm:block">각 반에는 전용 로그인 페이지가 있어요.</small></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {classes.map((classNo) => <a key={classNo} href={`/class/${classNo}`} className="group rounded-2xl border border-[#d6e3df] bg-white p-5 transition hover:-translate-y-1 hover:border-[#2ea69f] hover:shadow-lg"><span className="text-xs font-bold text-[#2ea69f]">6학년</span><div className="mt-2 flex items-center justify-between"><b className="display text-3xl">{classNo}반</b><span className="grid h-9 w-9 place-items-center rounded-full bg-[#edf5f2] transition group-hover:bg-[#163437] group-hover:text-white">→</span></div></a>)}
          </div>
        </div>
      </section>
    </main>
  );
}
