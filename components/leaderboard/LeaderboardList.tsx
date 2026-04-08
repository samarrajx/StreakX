"use client";
import { motion } from "framer-motion";
import { Trophy } from "@phosphor-icons/react";
import { LeaderboardEntry } from "@/lib/supabase/queries/leaderboard";

const GLOW = ["shadow-glow-gold", "shadow-[0_0_20px_rgba(192,192,192,0.4)]", "shadow-[0_0_20px_rgba(205,127,50,0.4)]"];
const ICON_COLORS = ["icon-glow-gold", "text-gray-300 icon-glow-white", "text-orange-600 shadow-glow-orange"];

export default function LeaderboardList({ entries, currentUserId }: { entries: LeaderboardEntry[]; currentUserId: string }) {
  if (entries.length === 0) return (
    <div className="glass-card p-8 text-center text-white/40 flex flex-col items-center gap-2">
      <Trophy size={32} weight="duotone" />
      No athletes yet. Be first!
    </div>
  );

  return (
    <div className="space-y-3">
      {entries.map((entry, i) => {
        const isMe = entry.user_id === currentUserId;
        const glow = GLOW[i] ?? "";

        return (
          <motion.div
            key={entry.user_id} layout
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 28 }}
            className={`glass-card p-4 flex items-center gap-3 transition-all
              ${isMe ? "border-accent-purple/50 bg-accent-purple/10" : ""}
              ${i === 0 ? "border-[#ffd700]/30" : ""}
            `}
          >
            {/* Rank */}
            <div className="w-9 flex flex-col items-center">
              {i < 3 ? <Trophy size={28} weight="fill" className={ICON_COLORS[i]} /> : <span className="text-white/40 font-bold text-sm">#{entry.rank}</span>}
            </div>

            {/* Avatar */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold text-white
              ${i === 0 ? "bg-streak-gradient" : i === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                i === 2 ? "bg-gradient-to-br from-yellow-600 to-yellow-800" : "bg-purple-gradient"}
            `}>
              {entry.display_name?.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`font-semibold truncate ${isMe ? "text-accent-purple-light" : "text-white"}`}>
                {entry.display_name} {isMe && <span className="text-xs">(you)</span>}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="h-1.5 flex-1 bg-white/8 rounded-full overflow-hidden max-w-[80px]">
                  <div className="h-full bg-streak-gradient rounded-full" style={{ width: `${entry.completion_percent}%` }} />
                </div>
                <span className="text-[10px] text-white/40">{entry.completion_percent}%</span>
              </div>
            </div>

            {/* Streak */}
            <div className="text-right">
              <p className="font-black text-xl streak-text">{entry.current_streak}</p>
              <p className="text-[9px] text-white/30 uppercase">days</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
