import type { PageTimers, GameConfig } from "@tiktok/types";

export const DEFAULT_TIMERS: PageTimers = {
  selectGameMs: 3 * 60_000,
  rulesMs: 60_000,
  roundSummaryMs: 30_000,
  scoreboardMs: 60_000,
  supportMs: 60_000,
};

// NOTE: Game configuration definitions. Keep ids stable; UI & persistence may rely on them.
// Each game now has unique description & rules (ภาษาไทย) reflecting actual mechanics.
export const GAMES: GameConfig[] = [
  {
    id: "guessWordTH",
    name: "ทายคำภาษาไทย",
    category: "guessWord",
    categoryDescription: "ทายคำ",
    description:
      "โฮสต์มีคำศัพท์หรือคำใบ้เป็นภาษาไทย ผู้เล่นพิมพ์คำตอบในแชท ใครตอบถูกก่อน รับคะแนนทันที",
    defaultRounds: 10,
    defaultRoundDurationMs: 40_000,
    gameImage: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
    rules: [
      "แต่ละรอบมี 1 คำศัพท์/คำใบ้ภาษาไทย",
      "พิมพ์คำตอบตรงๆ ในแชท (ไม่ต้องมีสัญลักษณ์พิเศษ)",
      "นับเฉพาะคำตอบแรกที่ถูกของแต่ละผู้เล่น",
      "ตอบถูกเป็นคนแรก = ได้เต็มคะแนน รอบนั้นจบ",
      "ถ้าไม่มีใครตอบถูกภายในเวลา จะเฉลยแล้วข้ามไปคำถัดไป",
    ],
    nameEn: "Thai Word Guess",
    descriptionEn:
      "Host has a Thai word or hint. Viewers type the exact answer in chat. First correct wins the points immediately.",
    categoryDescriptionEn: "Word Guessing",
    rulesEn: [
      "Each round has 1 Thai word or hint",
      "Type the exact answer in chat (no special symbols needed)",
      "Only the first correct answer from each player counts",
      "First overall correct gets full points and the round ends",
      "If time runs out, reveal the answer and move on",
    ],
  },
  {
    id: "guessWordEN",
    name: "ทายคำภาษาอังกฤษ",
    category: "guessWord",
    categoryDescription: "ทายคำ",
    description: "เหมือนทายคำไทย แต่เป็นคำศัพท์ภาษาอังกฤษ ฝึกคลังคำและการสะกด",
    defaultRounds: 10,
    defaultRoundDurationMs: 40_000,
    gameImage: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
    rules: [
      "คำใบ้หรือหมวดหมู่ (ถ้ามี) จะบอกก่อนเริ่มรอบ",
      "ต้องสะกดถูกต้อง (ไม่เคร่งตัวพิมพ์เล็ก/ใหญ่)",
      "คำตอบแรกที่ถูกของแต่ละคนเท่านั้นที่นับ",
      "คนที่ตอบถูกก่อนสุดในรอบ รับคะแนนเต็ม",
    ],
    nameEn: "English Word Guess",
    descriptionEn:
      "Same as Thai word guess but with English vocabulary. Practice spelling and word recall.",
    categoryDescriptionEn: "Word Guessing",
    rulesEn: [
      "Hint or category (if any) is given before the round",
      "Spelling must be correct (case-insensitive)",
      "Only the first correct answer per player counts",
      "First to answer correctly gets full points",
    ],
  },
  {
    id: "guessFlag",
    name: "ทายภาพธงชาติ",
    category: "guessPicture",
    categoryDescription: "ทายภาพ",
    description:
      "แสดงภาพธงชาติทีละภาพ ผู้เล่นพิมพ์ชื่อประเทศ (ไทยหรืออังกฤษก็ได้) ใครเร็วได้คะแนน",
    defaultRounds: 10,
    defaultRoundDurationMs: 35_000,
    gameImage: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
    rules: [
      "เห็นธงแล้วพิมพ์ชื่อประเทศในแชท (ภาษาไทยหรืออังกฤษได้)",
      "สะกดคลาดเคลื่อนเล็กน้อยอาจไม่ถูกนับ (ขึ้นอยู่กับตัวตรวจ)",
      "ตอบถูกเป็นคนแรก ได้คะแนนเต็มและจบรอบทันที",
      "หากหมดเวลาไม่มีคนถูก จะเฉลยแล้วไปภาพถัดไป",
    ],
    nameEn: "Guess the Flag",
    descriptionEn:
      "A flag is shown each round. Viewers type the country name (Thai or English). Fastest correct earns the points.",
    categoryDescriptionEn: "Picture Guessing",
    rulesEn: [
      "See the flag and type the country name (Thai or English)",
      "Minor spelling deviations may not count (depends on validator)",
      "First correct gets full points and ends the round",
      "If no one is correct by timeout, reveal and continue",
    ],
  },
  {
    id: "guessMottoTH",
    name: "ทายคำขวัญจังหวัด",
    category: "guessWord",
    categoryDescription: "ทายคำ",
    description:
      "ให้คำขวัญ (หรือบางส่วน) ของจังหวัดในประเทศไทย ให้ทายชื่อจังหวัดให้ถูก",
    defaultRounds: 8,
    defaultRoundDurationMs: 45_000,
    gameImage: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
    rules: [
      "แสดงคำขวัญหรือบางวลีสำคัญ 1 จังหวัดต่อรอบ",
      "พิมพ์ชื่อจังหวัดในแชท (ย่อ/ผิดสะกดอาจไม่ผ่าน)",
      "ตอบถูกคนแรก รับคะแนนเต็ม",
      "ถ้า 50% เวลาผ่านไป อาจให้เพิ่ม 1 คำใบ้",
    ],
    nameEn: "Province Motto Guess",
    descriptionEn:
      "A province motto (or part of it) is shown. Guess the correct Thai province name.",
    categoryDescriptionEn: "Word Guessing",
    rulesEn: [
      "One province motto or key phrase per round",
      "Type the province name in chat (abbreviations/spelling errors may not pass)",
      "First correct answer gets full points",
      "At 50% time remaining, an extra hint may appear",
    ],
  },
  {
    id: "wordleTH",
    name: "เกมเวิร์ดเดิลภาษาไทย",
    category: "wordle",
    categoryDescription: "ทายคำ",
    description:
      "เดายำตัวอักษรของคำภาษาไทยตามจำนวนช่อง ระบบให้สีบอกตำแหน่ง/มีตัวอักษรหรือไม่",
    defaultRounds: 6,
    defaultRoundDurationMs: 55_000,
    gameImage: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
    rules: [
      "เดาคำทีละคำ พิมพ์ทั้งคำในแชท",
      "สีเขียว = ตัวอักษรถูกและตำแหน่งถูก",
      "สีเหลือง = มีตัวอักษรนั้นในคำ แต่คนละตำแหน่ง",
      "สีเทา = ไม่มีตัวอักษรนั้นในคำ",
      "ทายถูกก่อนหมดรอบ รับคะแนนเต็ม ถ้าไม่สำเร็จไม่มีคะแนน",
    ],
    nameEn: "Thai Wordle",
    descriptionEn:
      "Guess the Thai word within limited attempts. Colors indicate correct letters and positions.",
    categoryDescriptionEn: "Word Guessing",
    rulesEn: [
      "Guess one full word per attempt in chat",
      "Green = letter correct & correct position",
      "Yellow = letter exists but different position",
      "Gray = letter not in target word",
      "Solve before attempts or time run out for full points",
    ],
  },
  {
    id: "wordleEN",
    name: "เกมเวิร์ดเดิลภาษาอังกฤษ",
    category: "wordle",
    categoryDescription: "ทายคำ",
    description:
      "เหมือน Wordle มาตรฐาน เดาคำภาษาอังกฤษ มี feedback สีบอกตำแหน่ง",
    defaultRounds: 6,
    defaultRoundDurationMs: 55_000,
    gameImage: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
    rules: [
      "พิมพ์คำที่มีความยาวตามช่อง (เช่น 5 ตัวอักษร)",
      "ระบบไฮไลต์ผลลัพธ์แต่ละตัว (เขียว / เหลือง / เทา)",
      "ใช้ข้อมูลรอบก่อนวางแผนเดาครั้งต่อไป",
      "ชนะเมื่อเดาคำถูกภายในจำนวนครั้งจำกัด",
    ],
    nameEn: "English Wordle",
    descriptionEn:
      "Standard Wordle gameplay with English words. Use color feedback to narrow possibilities.",
    categoryDescriptionEn: "Word Guessing",
    rulesEn: [
      "Type words of the required length (e.g., 5 letters)",
      "Each attempt highlights letters (Green / Yellow / Gray)",
      "Use feedback to plan next guess",
      "Win by solving within limited attempts",
    ],
  },
  {
    id: "contextoTH",
    name: "เกมคอนเท็กโตภาษาไทย",
    category: "contexto",
    categoryDescription: "ทายคำเชิงความหมาย",
    description:
      "ทายคำลับโดยพิมพ์คำอะไรก็ได้ ระบบจะให้คะแนนความใกล้เชิงความหมาย (ยิ่งตัวเลขน้อยยิ่งใกล้)",
    defaultRounds: 8,
    defaultRoundDurationMs: 50_000,
    gameImage: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
    rules: [
      "พิมพ์คำไทยใดๆ เพื่อวัดความใกล้กับคำเป้าหมาย",
      "ระบบตอบเป็นอันดับ (Rank) หรือคะแนนความใกล้ ยิ่งต่ำยิ่งดี",
      "ใช้ผลย้อนหลังกำหนดกลยุทธ์คำต่อไป",
      "ใครเดาคำเป้าถูกก่อน จบรอบ & ได้คะแนน",
    ],
    nameEn: "Thai Contexto",
    descriptionEn:
      "Guess the secret Thai word. Each guess returns a semantic closeness rank (lower is closer).",
    categoryDescriptionEn: "Semantic Guessing",
    rulesEn: [
      "Type any Thai word to gauge semantic closeness",
      "System returns a rank or closeness score (lower = closer)",
      "Use previous feedback to refine strategy",
      "First to guess the target word wins the round",
    ],
  },
  {
    id: "davinciTH",
    name: "เกมดาวินชีภาษาไทย",
    category: "davinci",
    categoryDescription: "ทายคำ",
    description:
      "เผยตัวอักษรของคำทีละส่วน ใครทายถูกก่อนยิ่งเร็วได้แต้มมาก (แนวเกม 'ดาวินชี เกม')",
    defaultRounds: 10,
    defaultRoundDurationMs: 45_000,
    gameImage: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
    rules: [
      "เริ่มรอบ: ซ่อนทุกตัวอักษรเป็นสัญลักษณ์ _",
      "ค่อยๆ เผยตัวอักษรตามเวลา (หรือยอดโหวต/อีเวนต์)",
      "พิมพ์ทั้งคำเพื่อทาย หากถูก รู้ผลทันที",
      "คะแนนปรับตามสัดส่วนตัวอักษรที่เปิดแล้ว (เปิดน้อย = คะแนนมาก)",
      "ทายผิดไม่โดนลบคะแนน แต่จะมีคูลดาวน์สั้นๆ (ถ้ากำหนด)",
    ],
    nameEn: "Thai Da Vinci Code",
    descriptionEn:
      "Letters of a Thai word are gradually revealed. Earlier correct guesses score higher.",
    categoryDescriptionEn: "Word Guessing",
    rulesEn: [
      "Round starts with all letters hidden ( _ )",
      "Letters reveal gradually (time or events)",
      "Type the full word to guess; if correct you win instantly",
      "Score scales with percentage of letters revealed (fewer = more points)",
      "Wrong guesses don't lose points but may impose a short cooldown",
    ],
  },
  {
    id: "memoryTest",
    name: "ทดสอบความจำ",
    category: "memory",
    categoryDescription: "ความจำ",
    description:
      "จำลำดับอีโมจิ/ตัวเลข/ตัวอักษรที่แสดงสั้นๆ แล้วพิมพ์ย้อนกลับให้ถูก ยิ่งรอบหลังยิ่งยาว",
    defaultRounds: 10,
    defaultRoundDurationMs: 35_000,
    gameImage: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
    rules: [
      "เริ่มรอบ: แสดงชุดลำดับ (เช่น 🔴🟢🟡) ชั่วครู่แล้วซ่อน",
      "ผู้เล่นพิมพ์ลำดับกลับเหมือนเดิม (รูปแบบที่กำหนด)",
      "ตอบถูกครบทุกตัว = ได้คะแนนเต็ม / ขาดตก = 0 หรือบางส่วน (ขึ้นกับ logic ภายหลัง)",
      "ความยาวจะเพิ่มขึ้นเมื่อผ่านรอบ เพื่อท้าทายมากขึ้น",
    ],
    nameEn: "Memory Challenge",
    descriptionEn:
      "Memorize a short sequence (emoji / numbers / letters) then type it back. Later rounds get longer.",
    categoryDescriptionEn: "Memory",
    rulesEn: [
      "Sequence displayed briefly each round then hidden",
      "Players retype the exact order (format rules TBD)",
      "Perfect recall = full points; partial may yield reduced or zero points (logic TBD)",
      "Sequence length increases over rounds",
    ],
  },
];
