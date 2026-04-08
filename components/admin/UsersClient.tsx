"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Shield, Gear, User as UserIcon } from "@phosphor-icons/react";

interface Profile { id: string; phone: string; display_name: string; role: string; workout_plan_id: string | null; }
interface Plan { id: string; name: string; }

export default function UsersClient({ initialProfiles, plans }: { initialProfiles: Profile[]; plans: Plan[] }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ phone: "", display_name: "", password: "sam123", role: "user", workout_plan_id: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed"); setLoading(false); return; }
    setProfiles(p => [data.profile, ...p]);
    setShowAdd(false);
    setForm({ phone: "", display_name: "", password: "sam123", role: "user", workout_plan_id: "" });
    setLoading(false);
  };

  const handlePlanChange = async (userId: string, planId: string) => {
    const supabase = createClient();
    await supabase.from("profiles").update({ workout_plan_id: planId || null }).eq("id", userId);
    setProfiles(p => p.map(pr => pr.id === userId ? { ...pr, workout_plan_id: planId || null } : pr));
  };

  const handleRoleChange = async (userId: string, role: string) => {
    const supabase = createClient();
    await supabase.from("profiles").update({ role }).eq("id", userId);
    setProfiles(p => p.map(pr => pr.id === userId ? { ...pr, role } : pr));
  };

  return (
    <div className="pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <motion.button whileTap={{ scale: 0.96 }} onClick={() => setShowAdd(true)} className="btn-primary px-4 py-2 text-sm">+ Add User</motion.button>
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAdd(false)}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-card p-6 w-full max-w-sm space-y-4">
              <h2 className="font-bold text-white text-lg">Add New User</h2>
              <form onSubmit={handleAdd} className="space-y-3">
                {[["Name", "display_name", "text", "Full name"], ["Phone", "phone", "tel", "9876543210"], ["Password", "password", "password", "Min 6 chars"]].map(([label, key, type, ph]) => (
                  <div key={key}>
                    <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">{label}</label>
                    <input type={type} placeholder={ph} value={(form as Record<string, string>)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-accent-purple/60 text-sm" required />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">Role</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full bg-black/40 border border-white/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-purple/60 text-sm cursor-pointer hover:bg-black/60 transition-colors">
                    <option value="user" className="bg-neutral-900">User</option>
                    <option value="manager" className="bg-neutral-900">Manager</option>
                    <option value="admin" className="bg-neutral-900">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">Workout Plan</label>
                  <select value={form.workout_plan_id} onChange={e => setForm(f => ({ ...f, workout_plan_id: e.target.value }))}
                    className="w-full bg-black/40 border border-white/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-purple/60 text-sm cursor-pointer hover:bg-black/60 transition-colors">
                    <option value="" className="bg-neutral-900">Default Plan</option>
                    {plans.map(p => <option key={p.id} value={p.id} className="bg-neutral-900">{p.name}</option>)}
                  </select>
                </div>
                {error && <p className="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost flex-1 py-2.5 text-sm">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5 text-sm">
                    {loading ? "Adding..." : "Add User"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users list */}
      <div className="space-y-2">
        {profiles.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-gradient flex items-center justify-center font-bold text-white shadow-glow-purple">
              {p.display_name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{p.display_name}</p>
              <div className="flex items-center gap-1 text-xs text-white/40 mt-0.5">
                <span>{p.phone}</span>
                <span>·</span>
                {p.role === "admin" ? <Shield size={14} weight="fill" className="text-streak-orange" /> : p.role === "manager" ? <Gear size={14} weight="fill" className="text-blue-400" /> : <UserIcon size={14} weight="fill" />}
                <span className="capitalize">{p.role}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <select value={p.role} onChange={e => handleRoleChange(p.id, e.target.value)}
                className="bg-black/40 border border-white/40 rounded-lg px-2 py-1.5 text-white text-[10px] focus:outline-none w-[90px] cursor-pointer hover:border-white/60 transition-colors">
                <option value="user" className="bg-neutral-900">User</option>
                <option value="manager" className="bg-neutral-900">Manager</option>
                <option value="admin" className="bg-neutral-900">Admin</option>
              </select>
              <select value={p.workout_plan_id ?? ""} onChange={e => handlePlanChange(p.id, e.target.value)}
                className="bg-black/40 border border-white/40 rounded-lg px-2 py-1.5 text-white text-[10px] focus:outline-none w-[90px] cursor-pointer hover:border-white/60 transition-colors">
                <option value="" className="bg-neutral-900">Default Plan</option>
                {plans.map(pl => <option key={pl.id} value={pl.id} className="bg-neutral-900">{pl.name}</option>)}
              </select>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
