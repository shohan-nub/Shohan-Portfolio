"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { signInAdmin } from "@/app/admin/actions";
import { PortfolioMark } from "@/components/portfolio-mark";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button className="admin-primary admin-login-submit" type="submit" disabled={pending}>
    {pending ? "Signing in…" : "Sign in securely"} <span aria-hidden="true">↗</span>
  </button>;
}

export function AdminLoginForm({ message }: { message: string }) {
  const [showPassword, setShowPassword] = useState(false);

  return <main className="admin-login">
    <div className="admin-login-ambient" aria-hidden="true" />
    <form action={signInAdmin} className="admin-login-card">
      <Link className="admin-login-brand" href="/" aria-label="Fazle Rabby Shohan portfolio home">
        <span className="admin-login-mark"><PortfolioMark /></span>
        <span><strong>FAZLE RABBY SHOHAN</strong><small>PRIVATE DEVELOPER WORKSPACE</small></span>
      </Link>
      <p className="admin-eyebrow">ADMINISTRATOR ACCESS</p>
      <h1>Welcome back.</h1>
      <p className="admin-login-copy">Sign in with your authorized administrator account.</p>
      <label>Email address<input name="email" type="email" autoComplete="username" maxLength={254} required /></label>
      <label>Password
        <span className="admin-password-field">
          <input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" maxLength={1024} required />
          <button type="button" className="admin-password-toggle" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? "HIDE" : "SHOW"}</button>
        </span>
      </label>
      {message && <p role="alert" className="admin-error">{message}</p>}
      <SubmitButton />
      <Link className="admin-back" href="/">← Return to portfolio</Link>
      <span className="admin-login-footnote">AUTHORIZED ADMINISTRATORS ONLY</span>
    </form>
  </main>;
}
