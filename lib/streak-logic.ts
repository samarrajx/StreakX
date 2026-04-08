import { createClient } from "@/lib/supabase/server";
import { getTodayIST } from "@/lib/ist-utils";

export async function computeAndUpdateStreak(userId: string): Promise<{
  streakUpdated: boolean;
  currentStreak: number;
  dayComplete: boolean;
}> {
  const supabase = await createClient();
  const today = getTodayIST();

  const { data: profile } = await supabase
    .from("profiles")
    .select("workout_plan_id")
    .eq("id", userId)
    .single();
  if (!profile) return { streakUpdated: false, currentStreak: 0, dayComplete: false };

  let planId = profile.workout_plan_id;
  if (!planId) {
    const { data: def } = await supabase.from("workout_plans").select("id").eq("is_active", true).order("created_at").limit(1).single();
    planId = def?.id;
  }
  if (!planId) return { streakUpdated: false, currentStreak: 0, dayComplete: false };

  const { data: allSets } = await supabase
    .from("exercise_sets")
    .select("id, exercises!inner(workout_plan_id)")
    .eq("exercises.workout_plan_id", planId);

  const totalCount = allSets?.length ?? 0;
  if (totalCount === 0) return { streakUpdated: false, currentStreak: 0, dayComplete: false };

  const allSetIds = allSets!.map((s: { id: string }) => s.id);

  const { data: completed } = await supabase
    .from("user_progress")
    .select("id")
    .eq("user_id", userId)
    .eq("date", today)
    .eq("is_completed", true)
    .in("exercise_set_id", allSetIds);

  const dayComplete = (completed?.length ?? 0) === totalCount;
  if (!dayComplete) {
    const { data: streak } = await supabase.from("streaks").select("current_streak").eq("user_id", userId).maybeSingle();
    return { streakUpdated: false, currentStreak: streak?.current_streak ?? 0, dayComplete: false };
  }

  const { data: cur } = await supabase.from("streaks").select("*").eq("user_id", userId).maybeSingle();
  if (cur?.last_completed_date === today) {
    return { streakUpdated: false, currentStreak: cur.current_streak, dayComplete: true };
  }

  let newStreak = 1;
  if (cur?.last_completed_date) {
    const last = new Date(cur.last_completed_date);
    const todayDate = new Date(today);
    const diff = Math.round((todayDate.getTime() - last.getTime()) / 86400000);
    if (diff === 1) newStreak = (cur.current_streak ?? 0) + 1;
    else if (diff === 0) newStreak = cur.current_streak ?? 1;
  }

  const newLongest = Math.max(newStreak, cur?.longest_streak ?? 0);

  await supabase.from("streaks").upsert({
    user_id: userId,
    current_streak: newStreak,
    longest_streak: newLongest,
    last_completed_date: today,
    total_completed_days: (cur?.total_completed_days ?? 0) + 1,
    total_possible_days: (cur?.total_possible_days ?? 0) + 1,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  return { streakUpdated: true, currentStreak: newStreak, dayComplete: true };
}
