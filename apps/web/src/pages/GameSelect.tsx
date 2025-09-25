import { useMemo } from "react";
import PageTransition from "../components/PageTransition";
import TimedProgressBar from "../components/TimedProgressBar";
import { DEFAULT_TIMERS } from "@tiktok/constants";

type GameItem = {
  id: string | number;
  title: string;
  category: string; // ประเภทเกม
  votes: number;
  highlight?: boolean; // true = วงกลมลำดับสีส้ม
  onClick?: (id: string | number) => void;
};

export default function GameSelect() {
  // mock data – ปรับ/แทนที่ด้วย API ของคุณได้
  const games: GameItem[] = useMemo(
    () => [
      { id: 0, title: "สุ่มเกม", category: "สุ่ม", votes: 15, highlight: true },
      {
        id: 1,
        title: "เกมทายคำภาษาไทย",
        category: "ทายคำ",
        votes: 25,
      },
      { id: 2, title: "เกมเวิร์ดเดิลภาษาไทย", category: "ทายคำ", votes: 12 },
      { id: 3, title: "เกมคอนเท็กซ์โตภาษาไทย", category: "ทายคำ", votes: 8 },
      { id: 4, title: "เกมทายธงชาติต่างประเทศ", category: "ทายภาพ", votes: 4 },
      { id: 5, title: "เกมทายคำจังหวัด", category: "ทายคำ", votes: 15 },
    ],
    [],
  );

  const handleClick = (id: GameItem["id"]) => {
    alert(`เลือกเกม id=${id}`);
  };

  return (
    <PageTransition className="gap-5">
      <TimedProgressBar
        duration={DEFAULT_TIMERS.selectGameMs}
        onComplete={() => console.warn("done!")}
        className="w-85"
        trackClassName="bg-white/20"
        barClassName="bg-tangerine-pop"
      />
      <div className="flex flex-col">
        {/* Header strip */}
        <h2 className="text-3xl text-white text-center font-extrabold">
          เลือกเกม
        </h2>
        <h4 className="text-xl text-arctic-sky text-center">
          (สำหรับผู้ติดตามเท่านั้น)
        </h4>
        <hr className="mt-6" />

        {/* Body */}
        <div className="p-5 space-y-5">
          {games.map((g) => (
            <button
              key={g.id}
              onClick={() => (g.onClick ?? handleClick)(g.id)}
              className="w-full text-left group"
            >
              {/* meta */}
              <div className="px-2 text-lg text-[#a7d3ff]/90 flex items-center gap-4 mb-1">
                <span>
                  <span className="opacity-80">ประเภท:</span>{" "}
                  <span className="font-semibold">{g.category}</span>
                </span>
                <span className="opacity-80">
                  โหวต:{" "}
                  <span className="font-semibold text-white">{g.votes}</span>
                </span>
              </div>

              {/* pill */}
              <div className="relative bg-black text-white rounded-full h-14 flex items-center pl-16 pr-5 transition-transform duration-150 group-active:scale-[0.98]">
                {/* index bubble */}
                <div
                  className={[
                    "absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full grid place-items-center text-[#1b2a52] font-extrabold text-4xl",
                    g.highlight ? "bg-[#ffa654]" : "bg-[#b9dcff]",
                  ].join(" ")}
                >
                  {g.id}
                </div>

                {/* title */}
                <div className="font-medium text-lg tracking-wide truncate">
                  {g.title}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
