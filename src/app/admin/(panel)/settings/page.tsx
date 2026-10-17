import { signOutAdmin } from "@/app/admin/actions";

export default function AdminSettingsPage() {
  return <div className="admin-page"><header className="admin-page-head"><div><p className="admin-eyebrow">PREFERENCES</p><h1>Settings</h1><p>Manage your workspace access and security.</p></div></header>
    <section className="admin-panel settings-panel"><div><p className="admin-eyebrow">AUTHENTICATION</p><h2>Administrator account</h2><p>Only Supabase Auth users with the <code>app_metadata.role</code> claim set to <code>admin</code> can access this workspace and its protected endpoints.</p></div><form action={signOutAdmin}><button className="admin-secondary" type="submit">Sign out</button></form></section>
    <section className="admin-panel settings-panel"><div><p className="admin-eyebrow">DATA & STORAGE</p><h2>Connected services</h2><p>Portfolio content and public project images use Supabase. Project images upload through the protected server route to the portfolio-projects bucket.</p></div><span className="admin-status"><i/> Server configured</span></section>
  </div>;
}
