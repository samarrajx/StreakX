"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[#050507] text-white relative overflow-hidden text-center">
      {/* Background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-accent-purple/5 blur-[120px]" />

      <div className="relative z-10 max-w-md w-full">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative w-24 h-24 mx-auto mb-8"
        >
          <Image
            src="/brand/logo.png"
            alt="StreakX Logo"
            fill
            className="object-contain opacity-50 grayscale"
            priority
          />
        </motion.div>

        <h1 className="text-8xl font-black streak-text font-display tracking-tighter mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">You&apos;ve broken the streak.</h2>
        <p className="text-white/50 mb-10 leading-relaxed font-medium">
          The path you were following has ended. Don&apos;t let this distract you from your destination. Get back to the dashboard and resume your mission.
        </p>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Link
            href="/"
            className="btn-primary w-full py-4 text-base font-bold tracking-tight inline-block"
          >
            RETURN TO DISCIPLINE
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-black">
          STREAKX • PRODUCTION ENGINE
        </p>
      </div>
    </div>
  );
}
