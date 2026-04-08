import { getAllWorkoutPlans } from "@/lib/supabase/queries/workout";
import WorkoutsClient from "@/components/admin/WorkoutsClient";

export default async function AdminWorkoutsPage() {
  const plans = await getAllWorkoutPlans();
  return <WorkoutsClient initialPlans={plans as Parameters<typeof WorkoutsClient>[0]["initialPlans"]} />;
}
