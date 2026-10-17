import { createClient } from "@supabase/supabase-js";
import { createInterface } from "node:readline/promises";
import { stdin, stdout, exit } from "node:process";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Configure them in .env.local before running this local setup script.");
  exit(1);
}

const input = createInterface({ input: stdin, output: stdout });
try {
  const email = (await input.question("Email of the existing Supabase Auth user to authorize as admin: ")).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    console.error("Enter a valid email address.");
    exit(1);
  }

  const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  let page = 1;
  let user = null;
  while (!user) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error("Could not look up Auth users: " + error.message);
    user = data.users.find((candidate) => candidate.email?.toLowerCase() === email) ?? null;
    if (user || data.users.length < 1000) break;
    page += 1;
  }

  if (!user) {
    console.error("No matching Auth account exists. Create/invite the user in the Supabase Dashboard first; this script never creates accounts.");
    exit(1);
  }
  if (user.app_metadata?.role === "admin") {
    console.log("This account is already an administrator. No changes made.");
    exit(0);
  }

  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { ...user.app_metadata, role: "admin" },
  });
  if (error) throw new Error("Could not assign administrator access: " + error.message);
  console.log("Administrator role assigned. Sign in again at /admin/login to refresh the session.");
} catch (error) {
  console.error(error instanceof Error ? error.message : "Administrator setup failed.");
  exit(1);
} finally {
  input.close();
}
