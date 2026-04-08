"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { House, Flame, Trophy, User } from "@phosphor-icons/react";

const NAV = [
  { href: "/", label: "Home", Icon: House },
  { href: "/streak", label: "Streak", Icon: Flame },
  { href: "/leaderboard", label: "Ranks", Icon: Trophy },
  { href: "/profile", label: "Profile", Icon: User },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass-card rounded-b-none rounded-t-2xl border-b-0 px-2 py-2 mx-0">
        <div className="flex items-center justify-around">
          {NAV.map(({ href, label, Icon }) => {
            const active = path === href;
            return (
              <Link key={href} href={href} className="relative flex flex-col items-center gap-0.5 px-4 py-2 min-w-[60px]">
                {active && (
                  <motion.div layoutId="nav-pill"
                    className="absolute inset-0 bg-accent-purple/20 border border-accent-purple/30 rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={{ scale: active ? 1.15 : 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="relative z-10"
                >
                  <Icon 
                    size={24} 
                    weight={active ? "fill" : "duotone"} 
                    className={active ? "icon-glow-white text-white" : "text-white/60"} 
                  />
                </motion.div>
                <span className={`text-[10px] font-medium relative z-10 transition-colors ${active ? "text-white" : "text-white/40"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
