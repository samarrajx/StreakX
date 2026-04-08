import { createClient } from "@/lib/supabase/server";

export interface SpecialDay {
  id: string; date: string; type: "holiday" | "rest" | "gym_closed"; note: string | null; created_by: string | null;
}

export async function getTodaySpecialDay(date: string): Promise<SpecialDay | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("special_days").select("*").eq("date", date).maybeSingle();
  return data;
}

export async function getSpecialDaysByRange(start: string, end: string): Promise<SpecialDay[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("special_days").select("*").gte("date", start).lte("date", end).order("date");
  return data ?? [];
}

export async function getAllSpecialDays(): Promise<SpecialDay[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("special_days").select("*").order("date", { ascending: false });
  return data ?? [];
}
