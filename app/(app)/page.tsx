import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTodayIST } from "@/lib/ist-utils";
import { getUserWorkoutPlan } from "@/lib/supabase/queries/workout";
import { getTodayProgress } from "@/lib/supabase/queries/progress";
import { getUserStreak } from "@/lib/supabase/queries/streaks";
import { getTodaySpecialDay } from "@/lib/supabase/queries/special-days";
import WorkoutView from "@/components/workout/WorkoutView";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = getTodayIST();
  const [workoutPlan, todayProgress, streak, specialDay] = await Promise.all([
    getUserWorkoutPlan(user.id),
    getTodayProgress(user.id, today),
    getUserStreak(user.id),
    getTodaySpecialDay(today),
  ]);

  return (
    <WorkoutView
      userId={user.id}
      date={today}
      workoutPlan={workoutPlan}
      initialProgress={todayProgress}
      streak={streak}
      specialDay={specialDay}
    />
  );
}
