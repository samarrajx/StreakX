import { getAllProfiles } from "@/lib/supabase/queries/profiles";
import { getAllWorkoutPlans } from "@/lib/supabase/queries/workout";
import UsersClient from "@/components/admin/UsersClient";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/admin");

  const [profiles, plans] = await Promise.all([getAllProfiles(), getAllWorkoutPlans()]);
  const simplePlans = plans.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name }));
  return <UsersClient initialProfiles={profiles} plans={simplePlans} />;
}
