"use client";
import { useState, useTransition, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkoutPlan, ExerciseSet } from "@/lib/supabase/queries/workout";
import { SetProgress } from "@/lib/supabase/queries/progress";
import { StreakData } from "@/lib/supabase/queries/streaks";
import { SpecialDay } from "@/lib/supabase/queries/special-days";
import ExerciseCard from "./ExerciseCard";
import DayCompleteModal from "@/components/animations/DayCompleteModal";
import StreakCounter from "@/components/streak/StreakCounter";
import { toggleSetComplete } from "@/app/actions/workout";
import { formatDisplayDate } from "@/lib/ist-utils";

const SPECIAL_LABELS: Record<string, { icon: string; label: string; color: string }> = {
  holiday: { icon: "🎉", label: "Holiday", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
  rest: { icon: "😴", label: "Rest Day", color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
  gym_closed: { icon: "🏢", label: "Gym Closed", color: "text-red-400 border-red-400/30 bg-red-400/10" },
};

interface Props {
  userId: string; date: string;
  workoutPlan: WorkoutPlan | null; initialProgress: SetProgress[];
  streak: StreakData; specialDay: SpecialDay | null;
}

export default function WorkoutView({ userId, date, workoutPlan, initialProgress, streak, specialDay }: Props) {
  const [progress, setProgress] = useState<SetProgress[]>(initialProgress);
  const [pendingSets, setPendingSets] = useState<Set<string>>(new Set());
  const [currentStreak, setCurrentStreak] = useState(streak.current_streak);
  const [showComplete, setShowComplete] = useState(false);
  const [isPending, startTransition] = useTransition();
  void isPending;

  // Cycle logic
  const totalDays = workoutPlan?.total_days || 7;
  // Use a Reference Date to make the cycle predictable
  // Setting April 6, 2026 as "Day 1" makes Today (April 8) "Day 3"
  const referenceDate = new Date("2026-04-06").getTime();
  const currentDate = new Date(date).getTime();
  const dayCount = Math.floor((currentDate - referenceDate) / (1000 * 60 * 60 * 24));
  const cycleDay = (dayCount % totalDays) + 1;

  const todaysExercises = workoutPlan?.exercises.filter(e => e.day_number === cycleDay) ?? [];
  const allSets = todaysExercises.flatMap(e => e.exercise_sets) ?? [];
  const completedCount = allSets.filter(s => progress.find(p => p.exercise_set_id === s.id && p.is_completed)).length;
  const totalSets = allSets.length;
  const overallPct = totalSets > 0 ? Math.round((completedCount / totalSets) * 100) : 0;

  const handleToggle = useCallback((set: ExerciseSet, isCurrentlyComplete: boolean) => {
    // Optimistic update
    setPendingSets(prev => new Set(prev).add(set.id));
    setProgress(prev => {
      const existing = prev.find(p => p.exercise_set_id === set.id);
      if (existing) return prev.map(p => p.exercise_set_id === set.id ? { ...p, is_completed: !isCurrentlyComplete, completed_at: !isCurrentlyComplete ? new Date().toISOString() : null } : p);
      return [...prev, { exercise_set_id: set.id, is_completed: !isCurrentlyComplete, completed_at: !isCurrentlyComplete ? new Date().toISOString() : null }];
    });

    startTransition(async () => {
      const result = await toggleSetComplete(set.id, isCurrentlyComplete, date);
      if (result?.dayComplete && result.newStreak && result.newStreak !== currentStreak) {
        setCurrentStreak(result.newStreak);
        setShowComplete(true);
      }
      setPendingSets(prev => { const n = new Set(prev); n.delete(set.id); return n; });
    });
  }, [date, currentStreak]);

  const specialInfo = specialDay ? SPECIAL_LABELS[specialDay.type] : null;

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-white/40 text-sm mb-1">{formatDisplayDate(date)}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-white">{workoutPlan?.name ?? "Today's Workout"}</h1>
            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mt-0.5">Day {cycleDay} of {totalDays}</p>
          </div>
          <span className="text-xs text-white/40 bg-white/6 border border-white/10 rounded-full px-3 py-1">{overallPct}%</span>
        </div>
      </div>

      {/* Streak counter */}
      <div className="glass-card p-5 mb-5 flex items-center justify-center">
        <StreakCounter value={currentStreak} />
      </div>

      {/* Special day badge */}
      <AnimatePresence>
        {specialInfo && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`flex items-center gap-2 border rounded-xl px-4 py-3 mb-5 ${specialInfo.color}`}>
            <span className="text-xl">{specialInfo.icon}</span>
            <div>
              <p className="font-semibold text-sm">{specialInfo.label}</p>
              <p className="text-xs opacity-70">Recovery day — streak protected</p>
            </div>
            {specialDay?.note && <p className="ml-auto text-xs opacity-60">{specialDay.note}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overall progress */}
      <div className="mb-5 space-y-1.5">
        <div className="flex justify-between text-xs text-white/50">
          <span>{completedCount} of {totalSets} sets done</span>
          <span>{overallPct}% complete</span>
        </div>
        <div className="h-2 bg-white/8 rounded-full overflow-hidden">
          <motion.div className="h-full bg-purple-gradient rounded-full"
            animate={{ width: `${overallPct}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          />
        </div>
      </div>

      {/* Exercise cards */}
      {!workoutPlan ? (
        <div className="glass-card p-8 text-center">
          <p className="text-white/40">No workout plan assigned. Contact admin.</p>
        </div>
      ) : todaysExercises.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-4xl shadow-glow-blue border border-blue-500/20">
            😴
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Rest Day</h2>
            <p className="text-white/40 text-sm">No exercises scheduled for today.<br/>Focus on recovery!</p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {todaysExercises.map((ex, i) => (
            <motion.div key={ex.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <ExerciseCard exercise={ex} progress={progress} pending={pendingSets} onToggleSet={handleToggle} />
            </motion.div>
          ))}
        </div>
      )}

      <DayCompleteModal isOpen={showComplete} streak={currentStreak} onClose={() => setShowComplete(false)} />
    </div>
  );
}
