import { createClient } from "@/lib/supabase/server";

export interface Profile {
  id: string; phone: string; display_name: string; avatar_url: string | null;
  role: "admin" | "manager" | "user"; workout_plan_id: string | null; created_at: string;
}

export async function getCurrentProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return data;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function updateProfileWorkoutPlan(userId: string, planId: string) {
  const supabase = await createClient();
  await supabase.from("profiles").update({ workout_plan_id: planId }).eq("id", userId);
}
