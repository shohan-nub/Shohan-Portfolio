import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  project_section: "web_app" | "web_design";
  tech_stack: string[];
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  created_at: string;
}

export type CreateProjectInput = Omit<
  Project,
  "id" | "created_at"
>;

export type UpdateProjectInput = Partial<CreateProjectInput>;

export const projectsRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data as Project[];
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data as Project | null;
  },

  async findBySlug(slug: string) {
    const { data, error } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data as Pick<Project, "id"> | null;
  },

  async create(input: CreateProjectInput) {
    const { data, error } = await getSupabaseAdmin()
      .from("projects")
      .insert(input)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data as Project;
  },

  async update(id: string, input: UpdateProjectInput) {
    const { data, error } = await getSupabaseAdmin()
      .from("projects")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data as Project;
  },

  async delete(id: string) {
    const { error } = await getSupabaseAdmin()
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    return { success: true };
  },
};
