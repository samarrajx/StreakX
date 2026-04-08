import { createClient } from "@/lib/supabase/server";

export interface SetProgress { exercise_set_id: string; is_completed: boolean; completed_at: string | null; }

export async function getTodayProgress(userId: string, date: string): Promise<SetProgress[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("user_progress").select("exercise_set_id,is_completed,completed_at").eq("user_id", userId).eq("date", date);
  return data ?? [];
}

export async function getProgressByDateRange(userId: string, start: string, end: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("user_progress").select("exercise_set_id,date,is_completed").eq("user_id", userId).gte("date", start).lte("date", end);
  return data ?? [];
}

export async function getDayCompletions(userId: string, dates: string[]) {
  const supabase = await createClient();
  const { data } = await supabase.from("day_completions").select("*").eq("user_id", userId).in("date", dates);
  return data ?? [];
}
