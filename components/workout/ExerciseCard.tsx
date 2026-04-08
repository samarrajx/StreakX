"use client";
import { motion } from "framer-motion";
import { Exercise, ExerciseSet } from "@/lib/supabase/queries/workout";
import { SetProgress } from "@/lib/supabase/queries/progress";
import SetButton from "./SetButton";

interface Props {
  exercise: Exercise;
  progress: SetProgress[];
  pending: Set<string>;
  onToggleSet: (set: ExerciseSet, isComplete: boolean) => void;
}

const MUSCLE_COLORS: Record<string, string> = {
  Chest: "text-red-400", Legs: "text-yellow-400", Back: "text-blue-400",
  Core: "text-green-400", Arms: "text-purple-400", Shoulders: "text-pink-400",
};

export default function ExerciseCard({ exercise, progress, pending, onToggleSet }: Props) {
  const completedCount = exercise.exercise_sets.filter(s =>
    progress.find(p => p.exercise_set_id === s.id && p.is_completed)
  ).length;
  const total = exercise.exercise_sets.length;
  const pct = total > 0 ? (completedCount / total) * 100 : 0;
  const allDone = completedCount === total;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-4 transition-all duration-300 ${allDone ? "border-green-500/30 shadow-glow-green" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-base">{exercise.name}</h3>
          <span className={`text-xs font-medium ${MUSCLE_COLORS[exercise.muscle_group ?? ""] ?? "text-white/40"}`}>
            {exercise.muscle_group}
          </span>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className={`text-sm font-bold ${allDone ? "text-green-400" : "text-white/60"}`}>
            {completedCount}/{total}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/8 rounded-full mb-4 overflow-hidden relative shadow-inner">
        <motion.div
          className={`h-full rounded-full ${allDone ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-streak-orange/80 shadow-[0_0_8px_rgba(255,107,43,0.5)]'}`}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      {/* Sets */}
      <div className="flex flex-wrap gap-2">
        {exercise.exercise_sets.map(set => {
          const prog = progress.find(p => p.exercise_set_id === set.id);
          return (
            <SetButton
              key={set.id}
              setNumber={set.set_number}
              reps={set.reps}
              durationSeconds={set.duration_seconds}
              isComplete={prog?.is_completed ?? false}
              isPending={pending.has(set.id)}
              onClick={() => onToggleSet(set, prog?.is_completed ?? false)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
