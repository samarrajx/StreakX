import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserStreak } from "@/lib/supabase/queries/streaks";
import { getDayCompletions, getProgressByDateRange } from "@/lib/supabase/queries/progress";
import { getSpecialDaysByRange } from "@/lib/supabase/queries/special-days";
import { getTodayIST, getLastNDaysIST, getDayOfWeek, getDayNumber, isToday, getMonthName } from "@/lib/ist-utils";
import StreakCounter from "@/components/streak/StreakCounter";

export default async function StreakPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = getTodayIST();
  const days = getLastNDaysIST(30);
  const start = days[0], end = days[days.length - 1];

  const [streak, completions, specialDays] = await Promise.all([
    getUserStreak(user.id),
    getDayCompletions(user.id, days),
    getSpecialDaysByRange(start, end),
  ]);

  const completionMap = Object.fromEntries(completions.map((c: { date: string; day_complete: boolean }) => [c.date, c.day_complete]));
  const specialMap = Object.fromEntries(specialDays.map(s => [s.date, s.type]));

  const completionPct = streak.total_possible_days > 0
    ? Math.round((streak.total_completed_days / streak.total_possible_days) * 100) : 0;

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Your Streak</h1>

      {/* Big streak card */}
      <div className="glass-card p-6 flex flex-col items-center mb-6 border-streak-orange/20 shadow-glow-orange">
        <StreakCounter value={streak.current_streak} />
        <div className="flex gap-6 mt-5 pt-5 border-t border-white/8 w-full justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{streak.longest_streak}</p>
            <p className="text-xs text-white/40">Best streak</p>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{streak.total_completed_days}</p>
            <p className="text-xs text-white/40">Days done</p>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold purple-text">{completionPct}%</p>
            <p className="text-xs text-white/40">Completion</p>
          </div>
        </div>
      </div>

      {/* Calendar strip */}
      <div>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Last 30 Days</h2>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2">
          {days.map(day => {
            const done = completionMap[day];
            const special = specialMap[day];
            const todayDay = isToday(day);
            return (
              <div key={day} className={`flex flex-col items-center gap-1 min-w-[38px] rounded-xl py-2 px-1 border transition-all
                ${todayDay ? "border-accent-purple/60 bg-accent-purple/15" : "border-transparent"}
              `}>
                <span className="text-[9px] text-white/30 uppercase">{getDayOfWeek(day)}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold
                  ${done === true ? "bg-streak-gradient text-white shadow-glow-orange" :
                    done === false ? "bg-red-500/20 text-red-400" :
                    special ? "bg-blue-500/20 text-blue-400" :
                    "bg-white/5 text-white/30"}
                `}>
                  {special ? (special === "holiday" ? "🎉" : special === "rest" ? "😴" : "🏢") :
                    done === true ? "✓" : done === false ? "✗" : getDayNumber(day)}
                </div>
                <span className="text-[9px] text-white/25">{getMonthName(day)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational */}
      <div className="glass-card p-4 mt-5 text-center">
        {streak.current_streak >= 7 ? (
          <><p className="text-streak-orange font-bold">🔥 On fire! {streak.current_streak} days strong.</p>
          <p className="text-white/40 text-sm mt-1">You&apos;re in the top tier. Don&apos;t stop now.</p></>
        ) : streak.current_streak >= 3 ? (
          <><p className="text-yellow-400 font-bold">⚡ Building momentum — {streak.current_streak} days!</p>
          <p className="text-white/40 text-sm mt-1">Consistency is your superpower.</p></>
        ) : (
          <><p className="text-white/70 font-bold">🌱 Every champion starts here.</p>
          <p className="text-white/40 text-sm mt-1">Complete today&apos;s workout to start your streak.</p></>
        )}
      </div>
    </div>
  );
}
