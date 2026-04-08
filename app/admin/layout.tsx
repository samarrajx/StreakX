import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebarNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "manager"].includes(profile.role)) redirect("/");

  const isAdmin = profile.role === "admin";

  const links = [
    { href: "/admin", label: "Dashboard", iconId: "dashboard", show: isAdmin },
    { href: "/admin/users", label: "Users", iconId: "users", show: isAdmin },
    { href: "/admin/workouts", label: "Workouts", iconId: "workouts", show: true },
    { href: "/admin/special-days", label: "Special Days", iconId: "special_days", show: isAdmin },
  ].filter(l => l.show);

  return (
    <div className="min-h-dvh flex flex-col bg-[#050507]">
      <AdminSidebarNav links={links} role={profile.role} />
      <main className="flex-1 p-4 max-w-2xl w-full mx-auto relative z-0">
        {children}
      </main>
    </div>
  );
}
