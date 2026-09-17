export type QuizItem = {
  id: string;
  question: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
  explanation: string;
};

export type VersusItem = {
  id: string;
  left: string;
  right: string;
  prompt: string;
};

// MVP içerikleri. Daha sonra MongoDB/JSON içerik motoruna taşınacak.
export const QUIZ_ITEMS: QuizItem[] = [
  {
    id: "gsq-001",
    question: "Galatasaray UEFA Kupası finalinde hangi takımla karşılaştı?",
    options: ["Arsenal", "Leeds United", "Real Madrid"],
    correctIndex: 0,
    explanation: "Galatasaray, 17 Mayıs 2000'de Arsenal'i penaltılarla yenerek UEFA Kupası'nı kazandı.",
  },
  {
    id: "gsq-002",
    question: "Galatasaray'ın renkleri hangileridir?",
    options: ["Sarı-Kırmızı", "Sarı-Lacivert", "Kırmızı-Beyaz"],
    correctIndex: 0,
    explanation: "Kulübün geleneksel renkleri sarı ve kırmızıdır.",
  },
  {
    id: "gsq-003",
    question: "Galatasaray hangi yıl kuruldu?",
    options: ["1903", "1905", "1907"],
    correctIndex: 1,
    explanation: "Galatasaray Spor Kulübü 1905 yılında kuruldu.",
  },
];

export const VERSUS_ITEMS: VersusItem[] = [
  { id: "vs-001", left: "Hagi", right: "Sneijder", prompt: "10 numaranı seç" },
  { id: "vs-002", left: "Muslera", right: "Taffarel", prompt: "Kalecini seç" },
  { id: "vs-003", left: "Drogba", right: "Icardi", prompt: "Forvetini seç" },
];
