"use client";
import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [state, setState] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setState("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not send message");
      form.reset(); setState("Thanks — your message has been sent.");
    } catch (error) { setState(error instanceof Error ? error.message : "Could not send message."); }
    finally { setBusy(false); }
  }
  return <form id="contact-form" className="contact-form" onSubmit={submit}>
    <label>Your name<input name="name" required maxLength={100} autoComplete="name"/></label>
    <label>Email address<input name="email" type="email" required maxLength={254} autoComplete="email"/></label>
    <label>Subject <span className="optional">(OPTIONAL)</span><input name="subject" maxLength={160}/></label>
    <label>Tell me about it<textarea name="message" required minLength={10} maxLength={5000} rows={4}/></label>
    <label className="honeypot" aria-hidden="true">Leave this empty<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <button type="submit" disabled={busy}>{busy ? "SENDING…" : "SEND MESSAGE ↗"}</button>
    <p className="form-status" aria-live="polite">{state}</p>
  </form>;
}
