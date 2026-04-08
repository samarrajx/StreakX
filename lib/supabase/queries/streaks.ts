import { createClient } from "@/lib/supabase/server";

export interface StreakData {
  current_streak: number; longest_streak: number;
  last_completed_date: string | null; total_completed_days: number; total_possible_days: number;
}

export async function getUserStreak(userId: string): Promise<StreakData> {
  const supabase = await createClient();
  const { data } = await supabase.from("streaks").select("*").eq("user_id", userId).maybeSingle();
  return data ?? { current_streak: 0, longest_streak: 0, last_completed_date: null, total_completed_days: 0, total_possible_days: 0 };
}

export async function getAllStreaks() {
  const supabase = await createClient();
  const { data } = await supabase.from("streaks").select("*");
  return data ?? [];
}
