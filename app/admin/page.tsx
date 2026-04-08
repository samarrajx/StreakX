import { getAllProfiles } from "@/lib/supabase/queries/profiles";
import { getAllSpecialDays } from "@/lib/supabase/queries/special-days";
import { getAllWorkoutPlans } from "@/lib/supabase/queries/workout";
import { getAllStreaks } from "@/lib/supabase/queries/streaks";
import Link from "next/link";
import { Users, Flame, Barbell, CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role === "manager") redirect("/admin/workouts");
  if (profile?.role !== "admin") redirect("/");

  const [profiles, specialDays, plans, streaks] = await Promise.all([
    getAllProfiles(), getAllSpecialDays(), getAllWorkoutPlans(), getAllStreaks(),
  ]);

  const active = streaks.filter((s: { current_streak: number }) => s.current_streak > 0).length;
  const stats = [
    { label: "Total Users", value: profiles.filter(p => p.role === "user").length, Icon: Users, color: "text-white/80 icon-glow-white" },
    { label: "Active Streaks", value: active, Icon: Flame, color: "text-streak-orange icon-glow-orange", weight: "fill" },
    { label: "Workout Plans", value: plans.length, Icon: Barbell, color: "text-white/80 icon-glow-white" },
    { label: "Special Days", value: specialDays.length, Icon: CalendarBlank, color: "text-white/80 icon-glow-white" },
  ];

  return (
    <div className="pt-4 space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, Icon, color, weight }) => (
          <div key={label} className="glass-card p-4 text-center flex flex-col items-center">
            <div className="mb-2"><Icon size={32} weight={(weight as any) || "duotone"} className={color} /></div>
            <div className="text-3xl font-black text-white">{value}</div>
            <div className="text-xs text-white/40 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3">
        {[
          { href: "/admin/users", title: "Manage Users", desc: "Add users, assign workout plans", Icon: Users },
          { href: "/admin/workouts", title: "Manage Workouts", desc: "Edit exercises, sets, reps", Icon: Barbell },
          { href: "/admin/special-days", title: "Special Days", desc: "Holidays, rest days, gym closures", Icon: CalendarBlank },
        ].map(({ href, title, desc, Icon }) => (
          <Link key={href} href={href} className="glass-card glass-card-hover p-4 flex items-center gap-4">
            <Icon size={32} weight="duotone" className="text-white/70" />
            <div className="flex-1"><p className="font-semibold text-white">{title}</p><p className="text-xs text-white/40">{desc}</p></div>
            <span className="text-white/30 text-xl">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
