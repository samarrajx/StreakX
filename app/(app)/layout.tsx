import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/navigation/BottomNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-dvh flex flex-col">
      <main className="flex-1 pb-24 pt-[calc(0.75rem+env(safe-area-inset-top))]">{children}</main>
      <BottomNav />
    </div>
  );
}
