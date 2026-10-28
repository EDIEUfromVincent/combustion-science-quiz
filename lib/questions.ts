export type QuizQuestion = {
  id: number;
  category: "혼합과 변화" | "연소의 조건" | "연소 생성물" | "환경과 안전";
  type: "choice" | "boolean" | "short";
  question: string;
  context: string;
  options?: string[];
  answer: number | string[];
  hint: string;
  explanation: string;
};

export const questions: QuizQuestion[] = [
  { id: 1, category: "혼합과 변화", type: "choice", question: "우유에 식초를 섞었을 때 나타나는 변화로 알맞은 것은 무엇일까요?", context: "서로 다른 물질을 섞으면 성질이 변하기도 하고, 변하지 않기도 합니다.", options: ["우유가 굳어 덩어리가 생긴다", "식초가 얼음으로 변한다", "아무 변화도 일어나지 않는다", "우유가 금속으로 변한다"], answer: 0, hint: "식초의 산 성분이 우유 속 단백질에 영향을 줍니다.", explanation: "우유에 식초를 넣으면 우유 속 단백질이 엉겨 붙어 덩어리가 생깁니다." },
  { id: 2, category: "혼합과 변화", type: "boolean", question: "서로 다른 물질을 섞으면 물질의 성질은 언제나 변한다.", context: "문장이 옳으면 O, 옳지 않으면 X를 선택하세요.", options: ["O · 옳다", "X · 옳지 않다"], answer: 1, hint: "설탕과 물을 섞은 경우를 생각해 보세요.", explanation: "서로 다른 물질을 섞어도 성질이 변하지 않는 경우가 있습니다." },
  { id: 3, category: "혼합과 변화", type: "choice", question: "손난로 속 철가루가 산소와 섞일 때 나타나는 현상은 무엇일까요?", context: "봉지를 뜯은 뒤 손난로가 따뜻해지는 까닭을 떠올려 보세요.", options: ["주변의 열을 모두 빼앗는다", "빛만 내고 온도는 그대로다", "열이 발생하여 따뜻해진다", "철가루가 물로 변한다"], answer: 2, hint: "철이 산소와 반응할 때 에너지가 어떻게 나타날까요?", explanation: "철가루가 산소와 반응하면 열이 발생해 손난로가 따뜻해집니다." },
  { id: 4, category: "연소의 조건", type: "choice", question: "양초와 알코올이 탈 때 공통적으로 나타나는 두 가지는 무엇일까요?", context: "불꽃 주변에서 눈과 손으로 느낄 수 있는 변화를 생각해 보세요.", options: ["빛과 열", "물과 흙", "바람과 소리", "연기와 얼음"], answer: 0, hint: "불을 켰을 때 주변이 밝아지고 따뜻해집니다.", explanation: "물질이 산소와 만나 빛과 열을 내며 타는 현상을 연소라고 합니다." },
  { id: 5, category: "연소의 조건", type: "short", question: "물질이 산소와 만나 빛과 열을 내면서 타는 현상을 무엇이라고 할까요?", context: "두 글자로 입력하세요.", answer: ["연소"], hint: "이 단원의 제목에도 들어 있는 말입니다.", explanation: "이 현상을 연소라고 합니다." },
  { id: 6, category: "연소의 조건", type: "choice", question: "연소가 일어나기 위해 필요한 조건을 모두 고른 것은 무엇일까요?", context: "세 가지 조건 중 하나라도 없으면 연소가 계속되기 어렵습니다.", options: ["탈 물질, 산소, 발화점 이상의 온도", "탈 물질, 물, 낮은 온도", "산소, 얼음, 바람", "빛, 소리, 수증기"], answer: 0, hint: "불을 끄는 방법은 연소 조건 중 하나를 없애는 것입니다.", explanation: "연소에는 탈 물질, 산소, 발화점 이상의 온도가 필요합니다." },
  { id: 7, category: "연소의 조건", type: "short", question: "어떤 물질이 타기 시작하는 가장 낮은 온도를 그 물질의 무엇이라고 할까요?", context: "세 글자로 입력하세요.", answer: ["발화점"], hint: "불이 붙기 시작한다는 뜻과 관련된 말입니다.", explanation: "물질이 타기 시작하는 가장 낮은 온도를 발화점이라고 합니다." },
  { id: 8, category: "연소 생성물", type: "choice", question: "촛불을 덮은 통 안의 푸른색 염화 코발트 종이가 붉은색으로 변했습니다. 무엇을 알 수 있을까요?", context: "염화 코발트 종이는 물을 확인하는 데 사용합니다.", options: ["양초가 연소하면 물이 생긴다", "양초가 연소하면 산소만 생긴다", "양초가 연소하면 철이 생긴다", "양초가 연소하면 온도가 낮아진다"], answer: 0, hint: "푸른색 염화 코발트 종이는 물과 만나면 붉은색으로 변합니다.", explanation: "색 변화는 양초가 연소할 때 물이 생겼다는 증거입니다." },
  { id: 9, category: "연소 생성물", type: "choice", question: "연소 후 기체를 석회수에 넣었더니 뿌옇게 변했습니다. 확인된 물질은 무엇일까요?", context: "석회수는 특정 기체를 확인하는 대표적인 실험 도구입니다.", options: ["산소", "수소", "이산화 탄소", "질소"], answer: 2, hint: "사람이 숨을 내쉰 기체를 석회수에 넣어도 같은 변화가 나타납니다.", explanation: "석회수가 뿌옇게 변하는 것은 이산화 탄소가 있다는 증거입니다." },
  { id: 10, category: "환경과 안전", type: "choice", question: "종이 그릇에 물과 라면을 넣어 가열해도 종이 그릇에 불이 쉽게 붙지 않는 까닭은?", context: "물은 끓는 동안에도 주변에서 열을 계속 흡수합니다.", options: ["종이는 절대로 타지 않아서", "물이 열을 흡수해 종이 온도가 발화점 이상 오르기 어려워서", "라면이 산소를 모두 만들어서", "종이 그릇의 색이 밝아서"], answer: 1, hint: "종이가 타려면 종이의 온도가 발화점 이상이 되어야 합니다.", explanation: "물이 열을 흡수해 종이의 온도가 발화점 이상으로 오르기 어렵기 때문입니다." },
  { id: 11, category: "환경과 안전", type: "boolean", question: "마른 나무를 마찰해 불을 피우는 것은 물질이 타기 시작할 만큼 온도를 높이는 예이다.", context: "문장이 옳으면 O, 옳지 않으면 X를 선택하세요.", options: ["O · 옳다", "X · 옳지 않다"], answer: 0, hint: "마찰하면 열이 생기고 나무의 온도가 올라갑니다.", explanation: "마찰열이 나무의 온도를 발화점 이상으로 올리면 불이 붙을 수 있습니다." },
  { id: 12, category: "환경과 안전", type: "short", question: "연소 생성물 중 양이 많아지면 생태계에 피해를 줄 수 있는 기체는 무엇일까요?", context: "기후 변화와도 관련된 기체입니다.", answer: ["이산화탄소", "이산화 탄소", "co2"], hint: "석회수를 뿌옇게 만드는 기체입니다.", explanation: "이산화 탄소가 지나치게 많아지면 기후 변화와 해양 산성화 등에 영향을 줍니다." },
];

export function normalizeAnswer(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/g, "").toLowerCase();
}

export function isQuestionCorrect(question: QuizQuestion, answer: unknown) {
  if (question.type === "short") return (question.answer as string[]).some((item) => normalizeAnswer(item) === normalizeAnswer(answer));
  return answer === question.answer;
}
