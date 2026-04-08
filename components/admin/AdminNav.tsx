"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, Gear, CaretRight, ChartBar, Users, Barbell, CalendarBlank } from "@phosphor-icons/react";

interface LinkItem {
  href: string;
  label: string;
  iconId: string;
}

const ICON_MAP: Record<string, any> = {
  dashboard: ChartBar,
  users: Users,
  workouts: Barbell,
  special_days: CalendarBlank,
};

export function AdminSidebarNav({ links, role }: { links: LinkItem[]; role: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = role === "admin";

  return (
    <>
      {/* Minimal Topbar with Hamburger */}
      <div className="glass-card rounded-none border-x-0 border-t-0 px-4 flex items-center gap-3 sticky top-0 z-40 pt-[env(safe-area-inset-top)] h-[calc(60px+env(safe-area-inset-top))]">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
        >
          <List size={24} weight="bold" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <Gear size={18} weight="fill" className="text-white/40" />
          </div>
          <span className="text-white font-bold text-sm tracking-tight">
            {isAdmin ? "Admin Console" : "Manager Console"}
          </span>
        </div>

        <Link href="/" className="ml-auto text-[10px] uppercase font-bold tracking-widest text-white/30 hover:text-white transition-colors">
          Exit App
        </Link>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-[#0A0A0C] border-r border-white/10 flex flex-col shadow-2xl"
          >
            {/* Sidebar Header */}
            <div className="p-6 pt-[calc(1.5rem+env(safe-area-inset-top))] flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-gradient shadow-glow-purple flex items-center justify-center">
                  <Gear size={22} weight="fill" className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-none">StreakX</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Control Center</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/30 hover:text-white transition-colors"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <p className="px-3 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Main Menu</p>
              {links.map(({ href, label, iconId }) => {
                const isActive = pathname === href;
                const Icon = ICON_MAP[iconId] || Gear;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between group p-3 rounded-xl transition-all ${
                      isActive 
                        ? "bg-white/10 text-white shadow-glow-white border border-white/10" 
                        : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${isActive ? "bg-white/10 text-white" : "bg-white/5 text-white/40 group-hover:text-white"}`}>
                        <Icon size={18} weight={isActive ? "fill" : "duotone"} />
                      </div>
                      <span className="text-sm font-semibold tracking-tight">{label}</span>
                    </div>
                    {isActive && <CaretRight size={14} className="text-white/40" />}
                  </Link>
                );
              })}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-white/5 space-y-3">
              <Link
                href="/"
                className="flex items-center gap-3 p-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-sm"
              >
                <div className="p-2 rounded-lg bg-white/5 underline decoration-white/20">
                  ←
                </div>
                Return to Player App
              </Link>
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Logged in as</p>
                <p className="text-xs text-white/80 font-medium capitalize">{role}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
