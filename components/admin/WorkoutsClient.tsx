"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Barbell, Trash, CaretRight, Plus } from "@phosphor-icons/react";

interface ExSet { id: string; set_number: number; reps: number; duration_seconds: number | null; }
interface Exercise { id: string; name: string; muscle_group: string | null; day_number: number; order_index: number; exercise_sets: ExSet[]; }
interface Plan { id: string; name: string; description: string | null; total_days: number; is_active: boolean; exercises: Exercise[]; }

export default function WorkoutsClient({ initialPlans }: { initialPlans: Plan[] }) {
  const [plans, setPlans] = useState(initialPlans);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [addExForm, setAddExForm] = useState<Record<string, { name: string; muscle: string; sets: string; reps: string; day: string }>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const togglePlan = (id: string) => setExpanded(e => e === id ? null : id);

  const handleAddExercise = async (planId: string) => {
    const f = addExForm[planId];
    if (!f?.name || !f?.reps) return;
    setLoading(planId);
    const supabase = createClient();
    const plan = plans.find(p => p.id === planId);
    const maxOrder = Math.max(0, ...((plan?.exercises ?? []).map(e => e.order_index)));
    const dayNum = parseInt(f.day) || 1;
    const { data: ex } = await supabase.from("exercises")
      .insert({ workout_plan_id: planId, name: f.name, muscle_group: f.muscle || null, day_number: dayNum, order_index: maxOrder + 1 })
      .select().single();
    if (!ex) { setLoading(null); return; }
    const numSets = parseInt(f.sets) || 3;
    const repsNum = parseInt(f.reps) || 10;
    const setsToInsert = Array.from({ length: numSets }, (_, i) => ({ exercise_id: ex.id, set_number: i + 1, reps: repsNum }));
    const { data: createdSets } = await supabase.from("exercise_sets").insert(setsToInsert).select();
    setPlans(p => p.map(pl => pl.id !== planId ? pl : {
      ...pl, exercises: [...pl.exercises, { ...ex, exercise_sets: createdSets ?? [] }]
    }));
    setAddExForm(f => ({ ...f, [planId]: { name: "", muscle: "", sets: "3", reps: "10", day: "1" } }));
    setLoading(null);
  };

  const handleDeleteExercise = async (planId: string, exId: string) => {
    const supabase = createClient();
    await supabase.from("exercises").delete().eq("id", exId);
    setPlans(p => p.map(pl => pl.id !== planId ? pl : { ...pl, exercises: pl.exercises.filter(e => e.id !== exId) }));
  };

  return (
    <div className="pt-4 space-y-3">
      <h1 className="text-2xl font-bold text-white">Workout Plans</h1>
      {plans.map((plan, pi) => (
        <div key={plan.id} className="glass-card overflow-hidden">
          <button onClick={() => togglePlan(plan.id)} className="w-full p-4 flex items-center gap-3 text-left">
            <Barbell size={28} weight="duotone" className="text-white/80 icon-glow-white" />
            <div className="flex-1">
              <p className="font-semibold text-white">{plan.name}</p>
              <p className="text-xs text-white/40">{plan.exercises.length} exercises</p>
            </div>
            <motion.div animate={{ rotate: expanded === plan.id ? 90 : 0 }}>
              <CaretRight size={20} className="text-white/40" />
            </motion.div>
          </button>

          <AnimatePresence>
            {expanded === plan.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }} className="overflow-hidden border-t border-white/8">
                <div className="p-4 space-y-6">
                  {/* Group exercises by day */}
                  {Array.from({ length: plan.total_days || 7 }).map((_, i) => {
                    const dayNum = i + 1;
                    const dayExercises = plan.exercises.filter(e => e.day_number === dayNum);
                    return (
                      <div key={dayNum} className="space-y-2">
                        <h3 className="text-xs font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-8 h-px bg-white/10" />
                          Day {dayNum}
                          <span className="flex-1 h-px bg-white/10" />
                          {dayExercises.length === 0 && <span className="text-[10px] lowercase font-normal opacity-50 italic">Rest Day</span>}
                        </h3>
                        <div className="space-y-2">
                          {dayExercises.map((ex, ei) => (
                            <motion.div key={ex.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ei * 0.05 }}
                              className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3">
                              <div className="flex-1">
                                <p className="text-white font-medium text-sm">{ex.name}</p>
                                <p className="text-xs text-white/40">{ex.muscle_group} · {ex.exercise_sets.length} sets · {ex.exercise_sets[0]?.reps} reps</p>
                              </div>
                              <button onClick={() => handleDeleteExercise(plan.id, ex.id)} className="text-red-400/50 hover:text-red-400 transition-colors p-1.5 focus:outline-none">
                                <Trash size={18} weight="duotone" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Add exercise inline */}
                  <div className="border border-dashed border-white/15 rounded-xl p-3 space-y-2">
                    <p className="text-xs text-white/40 font-semibold uppercase tracking-wider">Add Exercise</p>
                    <div className="grid grid-cols-4 gap-2">
                      <input placeholder="Exercise name" value={addExForm[plan.id]?.name ?? ""}
                        onChange={e => setAddExForm(f => ({ ...f, [plan.id]: { ...f[plan.id] ?? { name:"",muscle:"",sets:"3",reps:"10",day:"1" }, name: e.target.value } }))}
                        className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent-purple/60 col-span-3" />
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-white/40 uppercase font-bold text-center">Day</label>
                        <select value={addExForm[plan.id]?.day ?? "1"}
                          onChange={e => setAddExForm(f => ({ ...f, [plan.id]: { ...f[plan.id] ?? { name:"",muscle:"",sets:"3",reps:"10",day:"1" }, day: e.target.value } }))}
                          className="bg-black/40 border border-white/30 rounded-lg px-1 py-2 text-white text-sm focus:outline-none focus:border-accent-purple/60 appearance-none text-center cursor-pointer hover:bg-black/60 transition-all">
                          {Array.from({ length: plan.total_days || 7 }).map((_, k) => (
                            <option key={k} value={k + 1} className="bg-neutral-900">{k + 1}</option>
                          ))}
                        </select>
                      </div>

                      <input placeholder="Muscle (e.g. Chest)" value={addExForm[plan.id]?.muscle ?? ""}
                        onChange={e => setAddExForm(f => ({ ...f, [plan.id]: { ...f[plan.id] ?? { name:"",muscle:"",sets:"3",reps:"10",day:"1" }, muscle: e.target.value } }))}
                        className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent-purple/60 col-span-2" />
                      
                      <div className="flex gap-1.5 col-span-2">
                        <div className="flex-1 flex flex-col gap-1">
                           <input placeholder="Sets" type="number" min="1" max="10" value={addExForm[plan.id]?.sets ?? "3"}
                            onChange={e => setAddExForm(f => ({ ...f, [plan.id]: { ...f[plan.id] ?? { name:"",muscle:"",sets:"3",reps:"10",day:"1" }, sets: e.target.value } }))}
                            className="bg-white/5 border border-white/20 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-accent-purple/60 w-full" />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                          <input placeholder="Reps" type="number" min="1" value={addExForm[plan.id]?.reps ?? "10"}
                            onChange={e => setAddExForm(f => ({ ...f, [plan.id]: { ...f[plan.id] ?? { name:"",muscle:"",sets:"3",reps:"10",day:"1" }, reps: e.target.value } }))}
                            className="bg-white/5 border border-white/20 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-accent-purple/60 w-full" />
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleAddExercise(plan.id)} disabled={loading === plan.id}
                      className="btn-primary w-full py-2 text-sm flex items-center justify-center gap-1.5 font-semibold">
                      {loading === plan.id ? "Adding..." : <><Plus weight="bold" /> Add Exercise</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      {plans.length === 0 && <div className="glass-card p-8 text-center text-white/40">No plans yet.</div>}
    </div>
  );
}
