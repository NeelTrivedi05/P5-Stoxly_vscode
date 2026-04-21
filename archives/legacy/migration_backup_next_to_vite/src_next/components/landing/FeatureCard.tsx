import type { FeatureItem } from "@/data/landingContent";

type FeatureCardProps = {
  item: FeatureItem;
};

function AnalyticsMockup() {
  return (
    <div className="h-48 rounded-2xl border border-cyan-300/20 bg-[#081225]/90 p-4 shadow-2xl shadow-cyan-900/40 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between text-xs text-cyan-100/90">
        <span>Growth Pulse</span>
        <span>+14.8%</span>
      </div>
      <div className="grid h-28 grid-cols-12 items-end gap-1">
        {[28, 36, 32, 52, 58, 44, 64, 71, 66, 78, 74, 89].map((height, i) => (
          <div
            key={i}
            className="rounded-t bg-gradient-to-t from-cyan-500/60 to-cyan-200"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function PortfolioMockup() {
  return (
    <div className="h-48 rounded-2xl border border-slate-100/10 bg-[#080d1c]/95 p-4 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">
      <h4 className="mb-3 text-xs font-semibold text-slate-300">Asset Mix</h4>
      <div className="space-y-2 text-sm">
        {[
          ["Silver", "24%", "bg-slate-300"],
          ["Stocks", "52%", "bg-cyan-400"],
          ["Tech", "24%", "bg-indigo-400"],
        ].map(([name, value, color]) => (
          <div key={name} className="rounded-xl bg-white/5 p-2">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-200">
              <span>{name}</span>
              <span>{value}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10">
              <div className={`h-full rounded-full ${color}`} style={{ width: value }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExecutionMockup() {
  return (
    <div className="h-48 rounded-2xl border border-emerald-200/15 bg-[#060f1f]/95 p-4 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
        <span>Execution</span>
        <span className="text-emerald-300">Signal: Strong</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
        <button className="rounded-xl border border-rose-300/20 bg-rose-500/10 p-3 text-rose-200">
          Sell
        </button>
        <button className="rounded-xl border border-emerald-200/20 bg-emerald-500/10 p-3 text-emerald-100">
          Buy
        </button>
      </div>
      <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/50">
        Confirm Order
      </button>
    </div>
  );
}

function MockupById({ id }: { id: string }) {
  if (id === "analytics") {
    return <AnalyticsMockup />;
  }
  if (id === "portfolio") {
    return <PortfolioMockup />;
  }
  return <ExecutionMockup />;
}

export function FeatureCard({ item }: FeatureCardProps) {
  return (
    <article className="relative mt-8 rounded-3xl border border-slate-200/80 bg-white p-6 pb-20 shadow-xl shadow-slate-300/30 drop-shadow-sm">
      <div className="absolute -left-1 -top-5 text-6xl font-black text-cyan-600/25">
        {item.index}
      </div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
        {item.eyebrow}
      </p>
      <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-900">
        {item.title}
      </h3>
      <p className="max-w-sm text-sm text-slate-600">{item.description}</p>

      <div className="pointer-events-none absolute -bottom-10 left-6 right-6 translate-y-2">
        <MockupById id={item.id} />
      </div>
    </article>
  );
}