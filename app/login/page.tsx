"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !password) { setError("Enter phone and password."); return; }
    setLoading(true); setError("");
    const supabase = createClient();
    const email = `${phone.replace(/\D/g, "")}@streakx.app`;
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    router.push("/"); router.refresh();
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 relative overflow-hidden bg-[#050507]">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-accent-purple/10 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent-blue/8 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative w-20 h-20 mx-auto mb-6 drop-shadow-2xl"
          >
            <Image
              src="/brand/logo.png"
              alt="StreakX Logo"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
          <h1 className="text-4xl font-black streak-text font-display tracking-tighter">StreakX</h1>
          <p className="text-white/40 mt-3 text-sm font-medium tracking-wide">THE FITNESS DISCIPLINE ENGINE</p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent-purple/60 focus:ring-1 focus:ring-accent-purple/40 transition-all text-base"
                autoComplete="tel"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent-purple/60 focus:ring-1 focus:ring-accent-purple/40 transition-all text-base pr-12"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors text-sm px-1">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="text-red-400/90 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 h-12 text-base">
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Sign In 🔥"}
            </motion.button>
          </form>

          <p className="text-center text-white/30 text-xs">
            Contact admin to get access
          </p>
        </div>
      </motion.div>
    </div>
  );
}
