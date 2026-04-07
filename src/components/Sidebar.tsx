"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconChart, IconShip, IconTrendUp, IconMap, IconOil } from "./Icons";

function IconBlog({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

const navItems = [
  {
    href: "/",
    label: "Overview",
    icon: IconChart,
    description: "Dashboard home",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    href: "/hormuz",
    label: "Strait of Hormuz",
    icon: IconShip,
    description: "Ship tracking & blockade",
    gradient: "from-cyan-500 to-teal-400",
  },
  {
    href: "/impact",
    label: "War Impact",
    icon: IconTrendUp,
    description: "Daily life & prices",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    href: "/conflict-map",
    label: "Conflict Map",
    icon: IconMap,
    description: "Live map & timeline",
    gradient: "from-red-500 to-rose-400",
  },
  {
    href: "/oil-energy",
    label: "Oil & Energy",
    icon: IconOil,
    description: "Markets & prices",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    href: "/blog",
    label: "Live Blog",
    icon: IconBlog,
    description: "Auto-updating articles",
    gradient: "from-purple-500 to-pink-400",
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop overlay — mobile only */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 h-screen w-[260px] bg-card-bg-solid border-r border-card-border flex flex-col z-50 transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b border-card-border">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
                <span className="text-white text-xs font-black tracking-tighter">CW</span>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-red animate-pulse-live" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-bold tracking-wide text-foreground">CRISIS WATCH</h1>
              <p className="text-[10px] text-muted tracking-wider uppercase">Iran-US Conflict</p>
            </div>
            {/* Close button — mobile only */}
            <button
              className="lg:hidden p-1.5 -mr-1.5 rounded-lg text-muted hover:text-foreground hover:bg-white/[0.06] transition-colors"
              onClick={onClose}
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 mb-3">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-widest">Dashboards</span>
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-white/[0.08] shadow-lg shadow-black/20"
                    : "hover:bg-white/[0.04]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-br ${item.gradient} shadow-md`
                      : "bg-white/[0.06] group-hover:bg-white/[0.1]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-muted-light group-hover:text-foreground"
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <div
                    className={`font-medium text-[13px] leading-tight ${
                      isActive ? "text-foreground" : "text-muted-light group-hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[10px] text-muted truncate">{item.description}</div>
                </div>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse-live flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-card-border space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
            <span className="text-[10px] text-muted">Auto-refresh: 60s</span>
          </div>
          <div className="text-[10px] text-muted leading-relaxed">
            Sources: Reuters, AP, GDELT, Al Jazeera
          </div>
        </div>
      </aside>
    </>
  );
}
