"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050507] overflow-hidden antialiased">
      {/* Cinematic Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-white/5 overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-full w-full bg-gradient-to-r from-transparent via-accent-purple to-transparent shadow-[0_0_15px_rgba(168,85,247,0.5)]"
        />
      </div>

      {/* Atmospheric Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-purple/5 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent-blue/3 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Shimmering Logo */}
        <div className="relative w-28 h-28 mb-8 group">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 grayscale brightness-200 blur-[2px] opacity-20"
          >
            <Image
              src="/brand/logo.png"
              alt="Background Logo"
              fill
              className="object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full h-full overflow-hidden mask-image-reveal"
          >
            <Image
              src="/brand/logo.png"
              alt="StreakX Logo"
              fill
              className="object-contain"
              priority
            />
            {/* Liquid Sweep Animation */}
            <motion.div
              animate={{ 
                x: ["-200%", "200%"]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.5
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-30deg]"
            />
          </motion.div>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[10px] font-black text-white uppercase tracking-[0.5em] font-display ml-2"
          >
            Synchronizing
          </motion.h2>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <div className="h-[1px] w-8 bg-white/10" />
        <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.4em]">
          Production Environment
        </p>
      </div>
    </div>
  );
}
