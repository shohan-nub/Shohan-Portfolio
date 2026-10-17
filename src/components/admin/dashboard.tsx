"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, dateLabel } from "@/components/admin/admin-utils";

type Project = { id: string; title: string; slug: string; featured: boolean; created_at: string };
type Skill = { id: string; name: string; category: string };
type Message = { id: string; name: string; email: string; subject: string | null; message: string; is_read: boolean; created_at: string };
export function Dashboard() {
  const [projects, setProjects] = useState<Project[] | null>(null); const [skills, setSkills] = useState<Skill[] | null>(null); const [messages, setMessages] = useState<Message[] | null>(null);
  const [errors, setErrors] = useState<{ projects?: string; skills?: string; messages?: string }>({});
  useEffect(() => {
    let active = true;
    Promise.allSettled([api<Project[]>("/api/projects"), api<Skill[]>("/api/skills"), api<Message[]>("/api/messages")]).then(results => {
      if (!active) return;
      const [projectResult, skillResult, messageResult] = results;
      if (projectResult.status === "fulfilled") setProjects(projectResult.value); else setErrors(current => ({ ...current, projects: projectResult.reason instanceof Error ? projectResult.reason.message : "Could not load projects." }));
      if (skillResult.status === "fulfilled") setSkills(skillResult.value); else setErrors(current => ({ ...current, skills: skillResult.reason instanceof Error ? skillResult.reason.message : "Could not load skills." }));
      if (messageResult.status === "fulfilled") setMessages(messageResult.value); else setErrors(current => ({ ...current, messages: messageResult.reason instanceof Error ? messageResult.reason.message : "Could not load messages." }));
    });
    return () => { active = false; };
  }, []);
  const retry = () => location.reload();
  return <div className="admin-page"><header className="admin-page-head"><div><p className="admin-eyebrow">YOUR WORK AT A GLANCE</p><h1>Overview<span>.</span></h1><p>A clear view of your portfolio activity.</p></div><span className="admin-date">CONTENT OVERVIEW</span></header>
    {Object.entries(errors).map(([section, message]) => <div role="alert" className="admin-alert" key={section}><span>{section[0].toUpperCase() + section.slice(1)}: {message}</span><button onClick={retry}>Retry</button></div>)}
    <div className="admin-stat-grid">{[["Total projects", projects?.length, projects === null], ["Featured work", projects?.filter(p => p.featured).length, projects === null], ["Total skills", skills?.length, skills === null], ["Messages", messages?.length, messages === null]].map(([label, value, loading]) => <article className="admin-stat" key={label as string}><span>{label}</span><strong>{loading ? <i className="admin-skeleton" /> : value ?? "—"}</strong><small>Portfolio data</small></article>)}</div>
    <div className="admin-dashboard-grid"><section className="admin-panel"><header className="admin-panel-head"><div><p className="admin-eyebrow">LATEST INBOX</p><h2>Recent messages</h2></div><Link href="/admin/messages">View all ↗</Link></header>{messages === null ? errors.messages ? <Empty text="Messages could not be loaded. See the error above." /> : <LoadingRows /> : messages.length ? messages.slice(0, 4).map(m => <Link href="/admin/messages" className="admin-activity-row" key={m.id}><span className={`admin-message-dot ${m.is_read ? "read" : ""}`} /><span className="admin-activity-main"><strong>{m.name}</strong><small>{m.subject || m.message}</small></span><time>{dateLabel(m.created_at)}</time></Link>) : <Empty text="No messages yet. New inquiries will appear here." />}</section>
      <section className="admin-panel"><header className="admin-panel-head"><div><p className="admin-eyebrow">RECENTLY ADDED</p><h2>Projects</h2></div><Link href="/admin/projects">Manage ↗</Link></header>{projects === null ? errors.projects ? <Empty text="Projects could not be loaded. See the error above." /> : <LoadingRows /> : projects.length ? [...projects].sort((a,b) => b.created_at.localeCompare(a.created_at)).slice(0, 4).map(p => <Link href="/admin/projects" className="admin-activity-row" key={p.id}><span className="admin-project-index">{p.title.slice(0,1)}</span><span className="admin-activity-main"><strong>{p.title}</strong><small>/{p.slug}</small></span>{p.featured && <em className="admin-pill">Featured</em>}</Link>) : <Empty text="No projects yet. Add your first portfolio project." />}</section></div>
  </div>;
}
function LoadingRows(){return <div className="admin-loading-list"><i/><i/><i/></div>}
function Empty({text}:{text:string}){return <p className="admin-empty">{text}</p>}
