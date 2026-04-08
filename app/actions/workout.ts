"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { computeAndUpdateStreak } from "@/lib/streak-logic";
import { getTodayIST } from "@/lib/ist-utils";

export async function toggleSetComplete(
  exerciseSetId: string,
  isCurrentlyComplete: boolean,
  date: string
): Promise<{ success: boolean; dayComplete: boolean; newStreak?: number }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, dayComplete: false };

  const today = getTodayIST();
  if (date !== today) return { success: false, dayComplete: false };

  await supabase.from("user_progress").upsert({
    user_id: user.id,
    exercise_set_id: exerciseSetId,
    date,
    is_completed: !isCurrentlyComplete,
    completed_at: !isCurrentlyComplete ? new Date().toISOString() : null,
  }, { onConflict: "user_id,exercise_set_id,date" });

  const result = await computeAndUpdateStreak(user.id);
  revalidatePath("/");
  revalidatePath("/streak");
  revalidatePath("/leaderboard");

  return { success: true, dayComplete: result.dayComplete, newStreak: result.dayComplete ? result.currentStreak : undefined };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
}
