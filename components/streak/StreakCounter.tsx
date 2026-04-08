"use client";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Flame } from "@phosphor-icons/react";

interface Props { value: number; size?: "sm" | "md" | "lg"; }

export default function StreakCounter({ value, size = "lg" }: Props) {
  const spring = useSpring(value, { stiffness: 100, damping: 20 });
  const display = useTransform(spring, v => Math.round(v).toString());

  useEffect(() => { spring.set(value); }, [value, spring]);

  const sizeMap = { sm: "text-3xl", md: "text-5xl", lg: "text-7xl" };
  const iconSizeMap = { sm: 28, md: 40, lg: 56 };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Flame size={iconSizeMap[size]} weight="fill" className="icon-glow-orange" />
        </motion.div>
        <motion.span className={`${sizeMap[size]} font-black streak-text tabular-nums`}>
          {display}
        </motion.span>
      </div>
      <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Day Streak</p>
    </div>
  );
}
