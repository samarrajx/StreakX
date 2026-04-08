"use client";
import { motion } from "framer-motion";
import { CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface Props {
  setNumber: number;
  reps: number;
  durationSeconds: number | null;
  isComplete: boolean;
  isPending: boolean;
  onClick: () => void;
}

export default function SetButton({ setNumber, reps, durationSeconds, isComplete, isPending, onClick }: Props) {
  const label = durationSeconds ? `${durationSeconds}s` : `${reps} reps`;

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      disabled={isPending}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border py-2.5 px-3 min-w-[72px] transition-all duration-200 select-none",
        isComplete ? "set-btn-complete icon-glow-green" : "set-btn-incomplete",
        isPending && "opacity-60 cursor-wait"
      )}
    >
      {isComplete && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="absolute inset-0 rounded-xl bg-green-500/10"
        />
      )}
      <span className="text-[10px] font-medium text-white/40 relative z-10">Set {setNumber}</span>
      <span className={cn("text-sm font-bold relative z-10 mt-0.5", isComplete ? "text-green-400" : "text-white/60")}>
        {isComplete ? <CheckCircle size={18} weight="fill" /> : label}
      </span>
      {!isComplete && <span className="text-[9px] text-white/30 relative z-10">{label}</span>}
    </motion.button>
  );
}
