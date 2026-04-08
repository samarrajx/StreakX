"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { logoutAction } from "@/app/actions/workout";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handle = async () => {
    setLoading(true);
    await logoutAction();
    router.push("/login");
  };
  return (
    <motion.button whileTap={{ scale: 0.97 }} onClick={handle} disabled={loading}
      className="btn-ghost w-full flex items-center justify-center gap-2 h-12 mt-2">
      {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "🚪 Sign Out"}
    </motion.button>
  );
}
