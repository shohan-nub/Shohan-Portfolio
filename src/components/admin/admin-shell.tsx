"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOutAdmin } from "@/app/admin/actions";

const navigation = [
  { href: "/admin", label: "Overview", icon: "◫" },
  { href: "/admin/projects", label: "Projects", icon: "▧" },
  { href: "/admin/skills", label: "Skills", icon: "✳" },
  { href: "/admin/messages", label: "Messages", icon: "✉" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    let active = true;
    fetch("/api/messages", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(result => {
      if (active && Array.isArray(result?.data)) setUnread(result.data.filter((m: { is_read: boolean }) => !m.is_read).length);
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  return <div className="admin-shell">
    <button className="admin-mobile-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
    {open && <button aria-label="Close menu" className="admin-scrim" onClick={() => setOpen(false)} />}
    <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
      <Link href="/admin" className="admin-logo"><span className="admin-logo-mark">P</span><span>PORTFOLIO<small>CONTROL ROOM</small></span></Link>
      <p className="admin-nav-label">WORKSPACE</p><nav>{navigation.map(item => {
        const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
        return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={active ? "active" : ""}><span className="admin-nav-icon">{item.icon}</span>{item.label}{item.href === "/admin/messages" && unread > 0 && <b className="admin-unread-badge">{unread}</b>}</Link>;
      })}</nav>
      <div className="admin-sidebar-bottom"><div className="admin-user-avatar">{email.slice(0, 1).toUpperCase()}</div><div className="admin-user-meta"><strong>{email}</strong><small>Administrator</small></div><form action={signOutAdmin}><button className="admin-signout" title="Sign out" aria-label="Sign out">↗</button></form></div>
    </aside>
    <main className="admin-content"><div className="admin-topbar"><span>Workspace <i>/</i> <b>{navigation.find(i => pathname === i.href || (i.href !== "/admin" && pathname.startsWith(i.href)))?.label ?? "Overview"}</b></span><a href="/" target="_blank" rel="noreferrer">View portfolio ↗</a></div>{children}</main>
  </div>;
}
