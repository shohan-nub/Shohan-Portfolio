"use server";

import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !password || password.length > 1024) redirect("/admin/login?error=credentials");
  const supabase = await getSupabaseServer();
  let result;
  try {
    result = await supabase.auth.signInWithPassword({ email, password });
  } catch {
    redirect("/admin/login?error=signin");
  }
  const { data, error } = result;
  if (error || !data.user) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=signin");
  }
  if (data.user.app_metadata?.role !== "admin") {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }
  redirect("/admin");
}

export async function signOutAdmin() {
  const supabase = await getSupabaseServer();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
