import { createClient } from "@/lib/supabase/server";

export interface LeaderboardEntry {
  user_id: string; display_name: string; avatar_url: string | null;
  current_streak: number; longest_streak: number; total_completed_days: number;
  completion_percent: number; rank: number;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("leaderboard").select("*").order("rank", { ascending: true });
  return data ?? [];
}
