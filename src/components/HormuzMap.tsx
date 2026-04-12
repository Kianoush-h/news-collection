"use client";

export default function HormuzMap() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-card-border flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold">Strait of Hormuz — Live Ship Tracker</h3>
          <p className="text-[11px] text-muted mt-0.5">Real-time vessel positions via MarineTraffic AIS data</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-glow" />
          <span className="text-[10px] text-muted font-mono">LIVE AIS</span>
        </div>
      </div>
      <iframe
        src="https://www.marinetraffic.com/en/ais/embed/zoom:8/centery:26.2/centerx:55.5/maptype:4/shownames:false/mmsi:0/shipid:0/port:0/showmenu:false/rememb498eraliase:false"
        width="100%"
        height={480}
        style={{ border: "none", display: "block", background: "#06060b" }}
        title="Strait of Hormuz Live Ship Tracker"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
