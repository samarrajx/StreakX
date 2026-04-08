import { createClient } from "@/lib/supabase/server";

export interface ExerciseSet {
  id: string; set_number: number; reps: number;
  weight_kg: number | null; duration_seconds: number | null; notes: string | null;
}
export interface Exercise {
  id: string; name: string; description: string | null;
  muscle_group: string | null; day_number: number; order_index: number; exercise_sets: ExerciseSet[];
}
export interface WorkoutPlan { id: string; name: string; description: string | null; total_days: number; exercises: Exercise[]; }

export async function getUserWorkoutPlan(userId: string): Promise<WorkoutPlan | null> {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("workout_plan_id").eq("id", userId).single();
  if (!profile) return null;

  let planId = profile.workout_plan_id;
  if (!planId) {
    const { data: def } = await supabase.from("workout_plans").select("id").eq("is_active", true).order("created_at").limit(1).single();
    planId = def?.id;
  }
  if (!planId) return null;

  const { data: plan } = await supabase
    .from("workout_plans")
    .select(`id,name,description,total_days,exercises(id,name,description,muscle_group,day_number,order_index,exercise_sets(id,set_number,reps,weight_kg,duration_seconds,notes))`)
    .eq("id", planId)
    .single();

  if (!plan) return null;
  // Sort by day_number then order_index
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plan.exercises.sort((a: any, b: any) => (a.day_number - b.day_number) || (a.order_index - b.order_index));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plan.exercises.forEach((ex: any) => ex.exercise_sets.sort((a: any, b: any) => a.set_number - b.set_number));
  return plan as WorkoutPlan;
}

export async function getAllWorkoutPlans() {
  const supabase = await createClient();
  const { data } = await supabase.from("workout_plans").select(`id,name,description,total_days,is_active,exercises(id,name,muscle_group,day_number,order_index,exercise_sets(id,set_number,reps,weight_kg,duration_seconds))`).order("created_at");
  return data ?? [];
}
