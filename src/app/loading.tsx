export default function Loading() {
  return (
    <div className="space-y-6 animate-slide-in" aria-busy="true" aria-live="polite">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="glass-card p-4 h-[110px] flex flex-col justify-between"
          >
            <div className="h-3 w-20 rounded bg-white/[0.05] animate-pulse-glow" />
            <div className="h-7 w-24 rounded bg-white/[0.07] animate-pulse-glow" />
            <div className="h-2.5 w-16 rounded bg-white/[0.04] animate-pulse-glow" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 glass-card p-5 h-[280px] flex flex-col gap-3">
          <div className="h-3 w-32 rounded bg-white/[0.05] animate-pulse-glow" />
          <div className="flex-1 rounded-lg bg-white/[0.03] animate-pulse-glow" />
        </div>
        <div className="lg:col-span-2 glass-card p-5 h-[280px] flex flex-col gap-3">
          <div className="h-3 w-24 rounded bg-white/[0.05] animate-pulse-glow" />
          <div className="flex-1 rounded-lg bg-white/[0.03] animate-pulse-glow" />
        </div>
      </div>
    </div>
  );
}
