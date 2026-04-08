import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/queries/profiles";
import { getUserStreak } from "@/lib/supabase/queries/streaks";
import LogoutButton from "@/components/profile/LogoutButton";
import { Flame, Lightning, CheckCircle, Percent, Gear, Shield } from "@phosphor-icons/react/dist/ssr";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profile, streak] = await Promise.all([getCurrentProfile(user.id), getUserStreak(user.id)]);


  const completionPct = streak.total_possible_days > 0
    ? Math.round((streak.total_completed_days / streak.total_possible_days) * 100) : 0;

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

      {/* Avatar + name */}
      <div className="glass-card p-6 flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-gradient flex items-center justify-center text-2xl font-bold text-white shadow-glow-purple">
          {profile?.display_name?.charAt(0).toUpperCase() ?? "?"}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {profile?.display_name}
            {profile?.role === "admin" && <Shield size={18} weight="fill" className="text-streak-orange icon-glow-orange" />}
            {profile?.role === "manager" && <Gear size={18} weight="fill" className="text-blue-400 icon-glow-blue" />}
          </h2>
          <p className="text-white/40 text-sm">📱 {profile?.phone}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Current Streak", value: streak.current_streak.toString(), sub: "days", Icon: Flame, color: "text-streak-orange icon-glow-orange" },
          { label: "Best Streak", value: streak.longest_streak.toString(), sub: "days", Icon: Lightning, color: "text-yellow-400 icon-glow-gold" },
          { label: "Days Completed", value: streak.total_completed_days.toString(), sub: "total", Icon: CheckCircle, color: "text-green-400 icon-glow-green" },
          { label: "Completion Rate", value: `${completionPct}%`, sub: "all time", Icon: Percent, color: "text-blue-400 icon-glow-blue" },
        ].map(({ label, value, sub, Icon, color }) => (
          <div key={label} className="glass-card p-4 text-center flex flex-col items-center">
            <Icon size={24} weight="duotone" className={`mb-1 ${color}`} />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-white/40 mt-0.5">{sub}</p>
            <p className="text-[10px] text-white/25 mt-0.5 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Admin link */}
      {["admin", "manager"].includes(profile?.role || "") && (
        <a href="/admin" className="glass-card block p-4 mb-4 flex items-center gap-3 glass-card-hover group">
          <Gear size={28} weight="duotone" className="text-white/80 group-hover:icon-glow-white transition-all" />
          <div className="flex-1">
            <p className="font-semibold text-white">{profile?.role === "admin" ? "Admin Panel" : "Manager Dashboard"}</p>
            <p className="text-xs text-white/40">Manage {profile?.role === "admin" ? "users, workouts & special days" : "workouts"}</p>
          </div>
          <span className="text-white/30">›</span>
        </a>
      )}

      <LogoutButton />
    </div>
  );
}
