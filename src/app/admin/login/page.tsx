import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAdminUser } from "@/lib/supabase-server";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import "../admin.css";
import "./login.css";

export const instant = false;

export default function AdminLoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  return <Suspense fallback={<main className="admin-login"><p className="admin-login-copy">Loading sign in…</p></main>}><AdminLoginContent {...props} /></Suspense>;
}

async function AdminLoginContent({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getAdminUser()) redirect("/admin");
  const { error } = await searchParams;
  const message = error === "unauthorized"
    ? "These credentials do not have administrator access."
    : error === "credentials" ? "Enter a valid email address and password."
    : error === "signin" ? "We could not sign you in. Check your details and try again."
    : "";

  return <AdminLoginForm message={message} />;
}
