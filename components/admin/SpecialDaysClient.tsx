"use client";
import { useState, createElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Confetti, Bed, Buildings, Trash } from "@phosphor-icons/react";

interface SpecialDay { id: string; date: string; type: string; note: string | null; }

const TYPE_META: Record<string, { icon: any; label: string; color: string }> = {
  holiday:    { icon: Confetti, label: "Holiday",    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  rest:       { icon: Bed, label: "Rest Day",   color: "text-blue-400   bg-blue-400/10   border-blue-400/30"   },
  gym_closed: { icon: Buildings, label: "Gym Closed", color: "text-red-400    bg-red-400/10    border-red-400/30"    },
};

export default function SpecialDaysClient({ initial }: { initial: SpecialDay[] }) {
  const [days, setDays] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ date: "", type: "holiday", note: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const supabase = createClient();
    const { data, error: err } = await supabase.from("special_days").insert({
      date: form.date, type: form.type, note: form.note || null,
    }).select().single();
    if (err) { setError(err.message); setLoading(false); return; }
    setDays(d => [data, ...d].sort((a, b) => b.date.localeCompare(a.date)));
    setShowAdd(false); setForm({ date: "", type: "holiday", note: "" }); setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("special_days").delete().eq("id", id);
    setDays(d => d.filter(x => x.id !== id));
  };

  return (
    <div className="pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Special Days</h1>
        <motion.button whileTap={{ scale: 0.96 }} onClick={() => setShowAdd(true)} className="btn-primary px-4 py-2 text-sm">+ Add</motion.button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAdd(false)}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              onClick={e => e.stopPropagation()} className="glass-card p-6 w-full max-w-sm space-y-4">
              <h2 className="font-bold text-white text-lg">Add Special Day</h2>
              <form onSubmit={handleAdd} className="space-y-3">
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">Date (IST)</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-purple/60 text-sm [color-scheme:dark]" required />
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full bg-black/40 border border-white/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-purple/60 text-sm cursor-pointer hover:bg-black/60 transition-colors">
                    <option value="holiday" className="bg-neutral-900">Holiday</option>
                    <option value="rest" className="bg-neutral-900">Rest Day</option>
                    <option value="gym_closed" className="bg-neutral-900">Gym Closed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">Note (optional)</label>
                  <input type="text" placeholder="e.g. Diwali holiday" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-accent-purple/60 text-sm" />
                </div>
                {error && <p className="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost flex-1 py-2.5 text-sm">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5 text-sm">{loading ? "Saving..." : "Save"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {days.length === 0 ? (
        <div className="glass-card p-8 text-center text-white/40">No special days configured.</div>
      ) : (
        <div className="space-y-2">
          {days.map((d, i) => {
            const meta = TYPE_META[d.type];
            return (
              <motion.div key={d.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="glass-card p-4 flex items-center gap-3">
                <span className={`border rounded-lg px-2 py-1.5 text-xs font-semibold flex items-center gap-1.5 ${meta.color}`}>
                  {createElement(meta.icon, { size: 14, weight: "fill" })} {meta.label}
                </span>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{d.date}</p>
                  {d.note && <p className="text-white/40 text-[10px] uppercase tracking-wider">{d.note}</p>}
                </div>
                <button onClick={() => handleDelete(d.id)}
                  className="text-red-400/60 hover:text-red-400 transition-colors p-1.5 focus:outline-none">
                  <Trash size={18} weight="duotone" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
