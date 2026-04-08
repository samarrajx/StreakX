"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Flame } from "@phosphor-icons/react";

interface Props { isOpen: boolean; streak: number; onClose: () => void; }

export default function DayCompleteModal({ isOpen, streak, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const end = Date.now() + 2500;
    const colors = ["#FF6B2B", "#7C3AED", "#3B82F6", "#FF8C5A", "#ffffff"];
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="glass-card p-8 text-center max-w-xs w-full relative overflow-hidden"
          >
            {/* Glow bg */}
            <div className="absolute inset-0 bg-streak-gradient opacity-10 rounded-2xl" />

            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="mb-4 relative z-10 flex justify-center"
            >
              <Flame size={72} weight="fill" className="icon-glow-orange" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-1 relative z-10">Day Complete!</h2>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
              className="relative z-10"
            >
              <span className="text-5xl font-black streak-text">{streak}</span>
              <span className="text-xl font-bold text-white/70 ml-2">Day Streak</span>
            </motion.div>
            <p className="text-white/50 mt-2 text-sm relative z-10">Don&apos;t break the chain.</p>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onClose}
              className="btn-primary w-full mt-6 relative z-10 font-bold tracking-wide"
            >KEEP GOING</motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
