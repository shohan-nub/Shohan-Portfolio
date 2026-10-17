import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
}

export type CreateSkillInput = Omit<
  Skill,
  "id" | "created_at"
>;

export type UpdateSkillInput = Partial<CreateSkillInput>;

export const skillsRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);

    return data as Skill[];
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data as Skill | null;
  },

  async create(input: CreateSkillInput) {
    const { data, error } = await getSupabaseAdmin()
      .from("skills")
      .insert(input)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data as Skill;
  },

  async update(id: string, input: UpdateSkillInput) {
    const { data, error } = await getSupabaseAdmin()
      .from("skills")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data as Skill;
  },

  async delete(id: string) {
    const { error } = await getSupabaseAdmin()
      .from("skills")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    return { success: true };
  },
};
