import type { HowItem } from "@/data/landingContent";

type HowItWorksCardProps = {
  item: HowItem;
};

export function HowItWorksCard({ item }: HowItWorksCardProps) {
  return (
    <article className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/30 drop-shadow-sm">
      <div className="absolute -left-1 -top-6 text-6xl font-black text-indigo-600/20">
        {item.index}
      </div>
      <h3 className="mb-3 pt-6 text-2xl font-black tracking-tight text-slate-900">
        {item.title}
      </h3>
      <p className="text-slate-600">{item.description}</p>
    </article>
  );
}