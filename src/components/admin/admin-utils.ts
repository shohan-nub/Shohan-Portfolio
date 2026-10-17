export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers }, cache: "no-store" });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    const message = body.error === "Supabase admin configuration is missing"
      ? "The server-side Supabase admin configuration is incomplete. Check the private server environment and restart the server."
      : body.error || "The request could not be completed.";
    throw new Error(message);
  }
  return body.data as T;
}

export function dateLabel(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
