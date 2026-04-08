"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050507] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-accent-purple/5 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-accent-blue/5 blur-[100px]" />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-24 h-24 mb-6"
        >
          <Image
            src="/brand/logo.png"
            alt="StreakX Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
        
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-xl font-bold tracking-tighter streak-text font-display">StreakX</h2>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 1, 0.2]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className="w-1.5 h-1.5 rounded-full bg-accent-purple"
              />
            ))}
          </div>
        </div>
      </div>

      <p className="absolute bottom-10 text-[10px] text-white/20 uppercase tracking-[0.3em] font-black">
        Preparing your daily discipline
      </p>
    </div>
  );
}
