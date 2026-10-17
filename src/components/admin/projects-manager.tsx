"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { api } from "@/components/admin/admin-utils";

type Project = { id: string; title: string; slug: string; description: string; project_section: "web_app" | "web_design"; tech_stack: string[]; image_url: string | null; live_url: string | null; github_url: string | null; featured: boolean; created_at: string };
type Draft = Omit<Project, "id" | "created_at" | "project_section"> & { project_section: Project["project_section"] | "" };
type UploadReceipt = { image_storage_path: string; image_upload_receipt: string } | null;
const blank: Draft = { title: "", slug: "", description: "", project_section: "", tech_stack: [], image_url: null, live_url: null, github_url: null, featured: false };
export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [query, setQuery] = useState(""); const [featuredOnly, setFeaturedOnly] = useState(false); const [editing, setEditing] = useState<Project | null | "new">(null); const [saving, setSaving] = useState(false);
  useEffect(() => { let active = true; api<Project[]>("/api/projects").then(data => { if (active) setProjects(data); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const filtered = useMemo(() => projects.filter(p => (!featuredOnly || p.featured) && `${p.title} ${p.slug} ${p.tech_stack.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [projects, query, featuredOnly]);
  async function save(project: Draft, receipt: UploadReceipt) { setSaving(true); setError(""); try { const body = { ...project, ...(receipt ?? {}) }; const updated = editing === "new" ? await api<Project>("/api/projects", { method: "POST", body: JSON.stringify(body) }) : await api<Project>(`/api/projects/${editing!.id}`, { method: "PATCH", body: JSON.stringify(body) }); setProjects(current => editing === "new" ? [updated, ...current] : current.map(p => p.id === updated.id ? updated : p)); setEditing(null); } catch (e) { const message = e instanceof Error ? e.message : "Unable to save project."; setError(message); throw e; } finally { setSaving(false); } }
  async function remove(project: Project) { if (!window.confirm(`Delete “${project.title}”? This action cannot be undone.`)) return; try { await api(`/api/projects/${project.id}`, { method: "DELETE" }); setProjects(current => current.filter(p => p.id !== project.id)); } catch (e) { setError(e instanceof Error ? e.message : "Unable to delete project."); } }
  async function toggle(project: Project) { try { const updated = await api<Project>(`/api/projects/${project.id}`, { method: "PATCH", body: JSON.stringify({ featured: !project.featured }) }); setProjects(current => current.map(p => p.id === updated.id ? updated : p)); } catch (e) { setError(e instanceof Error ? e.message : "Unable to update project."); } }
  return <div className="admin-page"><header className="admin-page-head"><div><p className="admin-eyebrow">PORTFOLIO CONTENT</p><h1>Projects<span>.</span></h1><p>Shape the work people remember.</p></div><button className="admin-primary" onClick={() => setEditing("new")}>＋ Add project</button></header>
    {error && <div role="alert" className="admin-alert">{error}<button onClick={() => setError("")}>Dismiss</button></div>}
    <section className="admin-panel"><div className="admin-toolbar"><label className="admin-search">⌕<input aria-label="Search projects" placeholder="Search title, slug, or technology" value={query} onChange={e => setQuery(e.target.value)} /></label><button onClick={() => setFeaturedOnly(v => !v)} className={`admin-filter ${featuredOnly ? "selected" : ""}`}>✦ Featured</button><span className="admin-result-count">{filtered.length} projects</span></div>
    {loading ? <div className="admin-table-loading"><i/><i/><i/></div> : error ? <div className="admin-empty-block"><span>!</span><h2>Projects unavailable</h2><p>{error}</p><button className="admin-secondary" onClick={() => location.reload()}>Retry</button></div> : filtered.length ? <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>PROJECT</th><th>DISPLAY SECTION</th><th>TECH STACK</th><th>STATUS</th><th>FEATURED</th><th className="right">ACTIONS</th></tr></thead><tbody>{filtered.map(project => <tr key={project.id}><td><div className="admin-project-cell">{project.image_url ? <Image src={project.image_url} alt="" width={74} height={68}/> : <span className="admin-project-thumb">{project.title.slice(0,1)}</span>}<span><strong>{project.title}</strong><small>/{project.slug}</small></span></div></td><td><span className="admin-project-type">{project.project_section === "web_design" ? "Web Design (Demo Only)" : "Website / Web App"}</span></td><td><div className="admin-tech-list">{project.tech_stack.slice(0, 3).map(t => <span key={t}>{t}</span>)}{project.tech_stack.length > 3 && <small>+{project.tech_stack.length - 3}</small>}</div></td><td><span className="admin-status"><i/>{project.image_url ? "Published" : "Draft"}</span></td><td><button aria-label={`Toggle ${project.title} featured`} className={`admin-toggle ${project.featured ? "on" : ""}`} onClick={() => toggle(project)}><i/></button></td><td><div className="admin-row-actions"><button onClick={() => setEditing(project)}>Edit</button><button className="danger" onClick={() => remove(project)}>Delete</button></div></td></tr>)}</tbody></table></div> : <div className="admin-empty-block"><span>▧</span><h2>{query || featuredOnly ? "No matching projects" : "Your next case study starts here."}</h2><p>{query || featuredOnly ? "Try adjusting your search or filter." : "Add a project to begin building your portfolio archive."}</p>{!query && <button className="admin-secondary" onClick={() => setEditing("new")}>Add your first project</button>}</div>}</section>
    {editing && <ProjectEditor project={editing === "new" ? null : editing} saving={saving} onClose={() => setEditing(null)} onSave={save} />}
  </div>;
}

function ProjectEditor({ project, saving, onClose, onSave }: { project: Project | null; saving: boolean; onClose: () => void; onSave: (draft: Draft, receipt: UploadReceipt) => Promise<void> }) {
  const [draft, setDraft] = useState<Draft>(project ? { title: project.title, slug: project.slug, description: project.description, project_section: project.project_section ?? "web_app", tech_stack: project.tech_stack, image_url: project.image_url, live_url: project.live_url, github_url: project.github_url, featured: project.featured } : blank);
  const [techText, setTechText] = useState(draft.tech_stack.join(", "));
  const [uploading, setUploading] = useState(false); const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const [receipt, setReceipt] = useState<UploadReceipt>(null);
  const uploadLock = useRef(false); const saveLock = useRef(false);
  const set = <Key extends keyof Draft>(key: Key, value: Draft[Key]) => setDraft(v => ({ ...v, [key]: value }));

  function upload(file?: File) {
    if (!file || uploadLock.current) return;
    const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!acceptedTypes.includes(file.type)) { setError("Choose a JPEG, PNG, WebP, or AVIF image."); return; }
    if (file.size === 0 || file.size > 5 * 1024 * 1024) { setError("Choose an image that is no larger than 5 MB."); return; }

    uploadLock.current = true; setUploading(true); setUploadProgress(0); setError(""); setNotice("");
    const body = new FormData(); body.append("file", file);
    const request = new XMLHttpRequest();
    request.open("POST", "/api/projects/upload");
    request.upload.onprogress = event => { if (event.lengthComputable) setUploadProgress(Math.round((event.loaded / event.total) * 100)); };
    request.onerror = () => { setError("Network error while uploading. Your project has not been saved; retry the image upload."); finish(); };
    request.onabort = () => { setError("The image upload was interrupted. Please try again."); finish(); };
    request.onload = () => {
      let response: { success?: boolean; data?: { public_url?: string; object_path?: string; upload_receipt?: string }; error?: string };
      try { response = JSON.parse(request.responseText); }
      catch { setError("The upload server returned an unreadable response. Please try again."); finish(); return; }
      if (request.status < 200 || request.status >= 300 || !response.success || !response.data?.public_url || !response.data.object_path || !response.data.upload_receipt) {
        setError(response.error || `Image upload failed (HTTP ${request.status}).`); finish(); return;
      }
      set("image_url", response.data.public_url);
      setReceipt({ image_storage_path: response.data.object_path, image_upload_receipt: response.data.upload_receipt });
      setNotice("Image uploaded securely. Save the project to publish it.");
      setUploadProgress(100); finish();
    };
    request.send(body);
    function finish() { uploadLock.current = false; setUploading(false); }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saveLock.current || saving || uploading) return;
    saveLock.current = true; setError(""); setNotice("");
    try { await onSave({ ...draft, tech_stack: techText.split(",").map(s => s.trim()).filter(Boolean) }, receipt); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to save project. Your uploaded image remains selected; retrying will not upload it again."); }
    finally { saveLock.current = false; }
  }

  return <div className="admin-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget && !uploading && !saving) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="project-editor-title" className="admin-editor"><header className="admin-editor-head"><div><p className="admin-eyebrow">PROJECT DETAILS</p><h2 id="project-editor-title">{project ? "Edit project" : "New project"}</h2></div><button type="button" aria-label="Close" disabled={uploading || saving} onClick={onClose}>×</button></header><form onSubmit={submit}>
    <div className="admin-form-grid"><label>Title<input required maxLength={120} value={draft.title} onChange={e => { set("title", e.target.value); if (!project) set("slug", e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")); }} /></label><label>Slug<input required maxLength={120} value={draft.slug} onChange={e => set("slug", e.target.value)} /></label><label className="span-two">Display Section<select required value={draft.project_section} onChange={e => set("project_section", e.target.value as Draft["project_section"])}><option value="" disabled>Select a section</option><option value="web_app">Website / Web App</option><option value="web_design">Web Design (Demo Only)</option></select><small>{draft.project_section === "web_app" ? "Functional applications, full-stack projects, and working software." : "Design concepts, UI experiments, and demo websites. This is labeled as a design concept on the public site."}</small></label><label className="span-two">Description<textarea required maxLength={5000} rows={4} value={draft.description} onChange={e => set("description", e.target.value)} /></label><label className="span-two">Tech stack <small>Comma separated</small><input value={techText} onChange={e => setTechText(e.target.value)} placeholder="Next.js, TypeScript, Supabase" /></label><label>Live URL<input type="url" placeholder="https://" value={draft.live_url ?? ""} onChange={e => set("live_url", e.target.value || null)} /></label><label>GitHub URL<input type="url" placeholder="https://" value={draft.github_url ?? ""} onChange={e => set("github_url", e.target.value || null)} /></label>
    <div className="span-two"><span className="admin-field-label">Project image</span><div className="admin-upload-row">{draft.image_url && <Image src={draft.image_url} alt="Project preview" width={140} height={96}/>}<label className="admin-upload-button">{uploading ? `Uploading ${uploadProgress}%…` : draft.image_url ? "Replace image" : "Upload image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading || saving} onChange={e => { upload(e.target.files?.[0]); e.currentTarget.value = ""; }}/></label><span>Supabase Storage · JPEG, PNG, WebP, AVIF · max 5 MB</span>{draft.image_url && <button type="button" className="admin-row-actions" onClick={() => { set("image_url", null); setReceipt(null); setUploadProgress(0); setNotice(""); }}>Remove</button>}</div>{uploading && <progress className="admin-upload-progress" max={100} value={uploadProgress}>{uploadProgress}%</progress>}{receipt && <small className="admin-upload-public-id">Storage object: {receipt.image_storage_path}</small>}</div>
    <label className="admin-checkbox span-two"><input type="checkbox" checked={draft.featured} onChange={e => set("featured", e.target.checked)}/>Feature this project on the public portfolio</label></div>
    {notice && <p role="status" className="admin-upload-notice">{notice}</p>}{error && <p role="alert" className="admin-error">{error}</p>}<footer className="admin-editor-actions"><button type="button" className="admin-secondary" disabled={uploading || saving} onClick={onClose}>Cancel</button><button className="admin-primary" disabled={saving || uploading}>{saving ? "Saving…" : "Save project"}</button></footer></form></section></div>;
}
