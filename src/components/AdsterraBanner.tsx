"use client";

import { useEffect, useRef } from "react";

interface AdsterraBannerProps {
  className?: string;
}

export default function AdsterraBanner({ className = "" }: AdsterraBannerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !wrapperRef.current) return;
    loaded.current = true;

    // Insert the exact Adsterra ad code
    const container = document.createElement("div");
    container.id = "container-7339219f90b60e73671395dc21f59eb7";
    wrapperRef.current.appendChild(container);

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src =
      "https://pl29137949.profitablecpmratenetwork.com/7339219f90b60e73671395dc21f59eb7/invoke.js";
    wrapperRef.current.insertBefore(script, container);
  }, []);

  if (process.env.NODE_ENV === "development") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-full rounded-xl border border-dashed border-muted/30 bg-white/[0.02] py-4 px-6 text-center">
          <span className="text-[11px] text-muted font-mono">AD PLACEMENT</span>
        </div>
      </div>
    );
  }

  return <div ref={wrapperRef} className={`flex items-center justify-center ${className}`} />;
}
