type NavDockProps = {
  className?: string;
};

const items = [
  { label: "Login", href: "#" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Get Started", href: "#get-started" },
];

export function NavDock({ className = "" }: NavDockProps) {
  return (
    <nav
      className={`pointer-events-auto mx-auto flex w-[min(1080px,94vw)] items-center justify-between rounded-full border border-white/40 bg-white/55 px-4 py-2 text-slate-900 shadow-2xl shadow-black/30 backdrop-blur-md saturate-150 sm:px-6 ${className}`}
      aria-label="Primary"
    >
      <div className="flex items-center gap-1 sm:gap-2">
        {items.slice(0, 2).map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="rounded-full px-3 py-2 text-xs font-bold tracking-tight transition hover:bg-white/80 sm:px-4 sm:text-sm"
          >
            {item.label}
          </a>
        ))}
      </div>

      <a
        href="#top"
        className="rounded-full bg-[#041025]/95 px-4 py-2 text-sm font-black tracking-[0.2em] text-white shadow-lg shadow-cyan-500/30 sm:px-6 sm:text-base"
      >
        STOXLY
      </a>

      <div className="flex items-center gap-1 sm:gap-2">
        {items.slice(2).map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="rounded-full px-3 py-2 text-xs font-bold tracking-tight transition hover:bg-white/80 sm:px-4 sm:text-sm"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}