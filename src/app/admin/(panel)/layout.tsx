import type { ReactNode } from "react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase-server";
import { AdminShell } from "@/components/admin/admin-shell";
import "../admin.css";

export const instant = false;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="admin-auth-loading">Opening secure workspace…</div>}><AdminGate>{children}</AdminGate></Suspense>;
}

async function AdminGate({ children }: { children: ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return <AdminShell email={user.email ?? "Administrator"}>{children}</AdminShell>;
}
