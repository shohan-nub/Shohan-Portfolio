import { getSupabaseAdmin } from "@/lib/supabase-admin";

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export type CreateMessageInput = Omit<
  Message,
  "id" | "created_at" | "is_read"
>;

export const messagesRepository = {
  async findAll() {
    const { data, error } = await getSupabaseAdmin()
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data as Message[];
  },

  async findById(id: string) {
    const { data, error } = await getSupabaseAdmin()
      .from("messages")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data as Message | null;
  },

  async create(input: CreateMessageInput) {
    const { data, error } = await getSupabaseAdmin()
      .from("messages")
      .insert(input)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data as Message;
  },

  async markAsRead(id: string) {
    const { data, error } = await getSupabaseAdmin()
      .from("messages")
      .update({ is_read: true })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data as Message;
  },

  async setReadStatus(id: string, isRead: boolean) {
    const { data, error } = await getSupabaseAdmin()
      .from("messages")
      .update({ is_read: isRead })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Message;
  },

  async delete(id: string) {
    const { error } = await getSupabaseAdmin()
      .from("messages")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    return { success: true };
  },
};
