import { getAllSpecialDays } from "@/lib/supabase/queries/special-days";
import SpecialDaysClient from "@/components/admin/SpecialDaysClient";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminSpecialDaysPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/admin");

  const days = await getAllSpecialDays();
  return <SpecialDaysClient initial={days} />;
}
