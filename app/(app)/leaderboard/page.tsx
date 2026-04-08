import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLeaderboard } from "@/lib/supabase/queries/leaderboard";
import LeaderboardList from "@/components/leaderboard/LeaderboardList";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const board = await getLeaderboard();

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Leaderboard</h1>
      <p className="text-white/40 text-sm mb-6">Ranked by streak · updated live</p>
      <LeaderboardList entries={board} currentUserId={user.id} />
    </div>
  );
}
