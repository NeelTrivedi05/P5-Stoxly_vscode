export type FeatureItem = {
  id: string;
  index: string;
  title: string;
  description: string;
  eyebrow: string;
};

export type HowItem = {
  id: string;
  index: string;
  title: string;
  description: string;
};

export const featureItems: FeatureItem[] = [
  {
    id: "analytics",
    index: "01",
    eyebrow: "Analytics",
    title: "Live Conviction Graph",
    description:
      "Glassmorphic growth charts merge momentum, sentiment, and volatility into one decision surface.",
  },
  {
    id: "portfolio",
    index: "02",
    eyebrow: "Portfolio",
    title: "Dark-Mode Allocation Board",
    description:
      "Track stocks, silver, and tech allocations with confidence ranges and inflation-aware balance health.",
  },
  {
    id: "execution",
    index: "03",
    eyebrow: "Execution",
    title: "Signal-First Trade Panel",
    description:
      "Act on unusual activity spikes from a sleek buy/sell console with guardrails before confirmation.",
  },
];

export const howItWorksItems: HowItem[] = [
  {
    id: "profile",
    index: "01",
    title: "Set Your Investor Profile",
    description:
      "Answer a 60-second onboarding flow with age, monthly savings, and investment horizon.",
  },
  {
    id: "watchlist",
    index: "02",
    title: "Build a Precision Watchlist",
    description:
      "Follow only stocks you care about and let Stoxly suppress generic market noise automatically.",
  },
  {
    id: "act",
    index: "03",
    title: "Receive Signals, Then Act",
    description:
      "Get sentiment and trader-activity triggers, then execute with confidence from one focused workspace.",
  },
];