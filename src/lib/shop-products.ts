export type ShopCategory = "calm" | "focus" | "selfCare";

export type ShopProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ShopCategory;
  icon: string;
};

export const shopProducts: ShopProduct[] = [
  {
    id: "calm-breathing-cards",
    name: "breathing cards",
    description: "pocket prompts for slowing anxious thoughts and breath.",
    price: 150,
    category: "calm",
    icon: "breath",
  },
  {
    id: "calm-lavender-scented-candle",
    name: "lavender scented candle",
    description: "a soft lavender ritual for easing mental overload.",
    price: 300,
    category: "calm",
    icon: "candle",
  },
  {
    id: "calm-chamomile-tea",
    name: "chamomile tea",
    description: "a gentle caffeine-free tea for winding down.",
    price: 900,
    category: "calm",
    icon: "tea",
  },
  {
    id: "calm-guided-journal",
    name: "guided journal",
    description: "structured pages for naming worries and putting them down.",
    price: 480,
    category: "calm",
    icon: "journal",
  },
  {
    id: "calm-fidget-tools",
    name: "fidget tools",
    description: "small grounding tools for restless hands and tense moments.",
    price: 199,
    category: "calm",
    icon: "fidget",
  },
  {
    id: "calm-dark-chocolate",
    name: "dark chocolate",
    description: "a small comforting treat for a softer reset.",
    price: 179,
    category: "calm",
    icon: "choco",
  },
  {
    id: "focus-pomodoro-timer",
    name: "pomodoro timer",
    description: "a phone-free timer for gentle focus sprints.",
    price: 699,
    category: "focus",
    icon: "timer",
  },
  {
    id: "focus-to-do-planner-pad",
    name: "to-do planner pad",
    description: "simple planning sheets for making tasks feel doable.",
    price: 399,
    category: "focus",
    icon: "planner",
  },
  {
    id: "focus-motivation-stickers",
    name: "motivation stickers",
    description: "tiny visual rewards for keeping momentum visible.",
    price: 249,
    category: "focus",
    icon: "stickers",
  },
  {
    id: "focus-granola-bars",
    name: "granola bars",
    description: "quick desk snacks for energy between tasks.",
    price: 200,
    category: "focus",
    icon: "snack",
  },
  {
    id: "focus-affirmation-cards",
    name: "affirmation cards",
    description: "short focus-friendly reminders for starting again.",
    price: 349,
    category: "focus",
    icon: "cards",
  },
  {
    id: "focus-acrylic-paints",
    name: "2 acrylic paints",
    description: "two small paints for a quick creative reset.",
    price: 179,
    category: "focus",
    icon: "paint",
  },
  {
    id: "focus-brush-canvas",
    name: "small brush and canvas",
    description: "a compact making kit for clearing stuck energy.",
    price: 110,
    category: "focus",
    icon: "canvas",
  },
  {
    id: "focus-chamomile-tea",
    name: "chamomile tea",
    description: "a calming pause between focused work blocks.",
    price: 900,
    category: "focus",
    icon: "tea",
  },
  {
    id: "focus-key-chain",
    name: "key chain",
    description: "a small daily cue to return to your plan.",
    price: 140,
    category: "focus",
    icon: "key",
  },
  {
    id: "selfcare-sheet-face-mask",
    name: "sheet face mask",
    description: "a low-effort care ritual for tired evenings.",
    price: 95,
    category: "selfCare",
    icon: "mask",
  },
  {
    id: "selfcare-scented-candle",
    name: "scented candle",
    description: "soft scent and light for making rest feel intentional.",
    price: 300,
    category: "selfCare",
    icon: "candle",
  },
  {
    id: "selfcare-gratitude-journal",
    name: "gratitude journal",
    description: "simple prompts for noticing what still feels good.",
    price: 480,
    category: "selfCare",
    icon: "gratitude",
  },
  {
    id: "selfcare-sleep-mask",
    name: "sleep mask",
    description: "a softer sleep cue for low-energy nights.",
    price: 109,
    category: "selfCare",
    icon: "sleep",
  },
  {
    id: "selfcare-energy-bars",
    name: "energy bars",
    description: "easy nourishment when motivation is running low.",
    price: 200,
    category: "selfCare",
    icon: "energy",
  },
  {
    id: "selfcare-peppermint-green-tea",
    name: "peppermint green tea",
    description: "a fresh, mood-lifting tea for gentle replenishment.",
    price: 599,
    category: "selfCare",
    icon: "mint",
  },
];

export const kitCategoryLabels: Record<ShopCategory, string> = {
  calm: "calm",
  focus: "focus",
  selfCare: "self-care",
};
