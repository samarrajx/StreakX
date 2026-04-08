import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  // Verify caller is admin
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { phone, display_name, password, role, workout_plan_id } = body;
  if (!phone || !display_name || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Use service role to create user (bypasses email confirmation)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });

  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
  const email = `${phone.replace(/\D/g, "")}@streakx.app`;

  const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { phone, display_name, role: role ?? "user" },
  });

  if (createErr) return NextResponse.json({ error: createErr.message }, { status: 400 });

  // Update additional profile fields
  if (workout_plan_id || role) {
    await admin.from("profiles").update({
      ...(workout_plan_id ? { workout_plan_id } : {}),
      ...(role ? { role } : {}),
    }).eq("id", newUser.user.id);
  }

  const { data: newProfile } = await admin.from("profiles").select("*").eq("id", newUser.user.id).single();
  return NextResponse.json({ profile: newProfile });
}
