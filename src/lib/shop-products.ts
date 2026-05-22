export type ShopCategory = "basic" | "focus" | "gift";

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
    id: "basic-breathing-stone",
    name: "breathing stone",
    description: "a smooth pocket anchor for slow pauses and busy hands.",
    price: 1100,
    category: "basic",
    icon: "stone",
  },
  {
    id: "basic-night-reset-tea",
    name: "night reset tea",
    description: "soft herbal tea for making the evening feel less loud.",
    price: 950,
    category: "basic",
    icon: "tea",
  },
  {
    id: "basic-guided-journal",
    name: "guided journal",
    description: "tiny prompts that turn mental clutter into one calm page.",
    price: 1450,
    category: "basic",
    icon: "journal",
  },
  {
    id: "basic-weighted-eye-pillow",
    name: "weighted eye pillow",
    description: "gentle pressure for screen-heavy days and restless nights.",
    price: 1800,
    category: "basic",
    icon: "moon",
  },
  {
    id: "focus-prompt-cards",
    name: "focus prompt cards",
    description: "one-card nudges for starting when every task feels sticky.",
    price: 1200,
    category: "focus",
    icon: "brain",
  },
  {
    id: "focus-soft-desk-timer",
    name: "soft desk timer",
    description: "a phone-free focus ritual with quieter edges.",
    price: 2100,
    category: "focus",
    icon: "timer",
  },
  {
    id: "focus-task-mist",
    name: "task mist",
    description: "a subtle desk spray for marking a clean beginning.",
    price: 1350,
    category: "focus",
    icon: "mist",
  },
  {
    id: "focus-tab-tamer-pad",
    name: "tab tamer pad",
    description: "a small planning pad for parking thoughts before work.",
    price: 900,
    category: "focus",
    icon: "pad",
  },
  {
    id: "gift-calming-candle",
    name: "calming candle",
    description: "a warm ritual light for rooms that need a softer signal.",
    price: 1650,
    category: "gift",
    icon: "candle",
  },
  {
    id: "gift-gratitude-notes",
    name: "gratitude notes",
    description: "small cards for giving care without making it complicated.",
    price: 850,
    category: "gift",
    icon: "note",
  },
  {
    id: "gift-comfort-socks",
    name: "comfort socks",
    description: "plush, grounding warmth for staying in and coming down.",
    price: 1250,
    category: "gift",
    icon: "socks",
  },
  {
    id: "gift-mini-calm-kit",
    name: "mini calm kit",
    description: "three tiny resets packed for a friend who is carrying a lot.",
    price: 2400,
    category: "gift",
    icon: "gift",
  },
];
