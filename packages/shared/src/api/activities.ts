import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
  ActivityFilters,
} from "../types/activity";

const DEFAULT_PAGE_SIZE = 20;

export async function createActivity(
  supabase: SupabaseClient,
  input: CreateActivityInput
): Promise<Activity> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("activities")
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getActivities(
  supabase: SupabaseClient,
  filters: ActivityFilters = {}
): Promise<{ data: Activity[]; count: number }> {
  const page = filters.page ?? 0;
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("activities")
    .select("*", { count: "exact" })
    .order("start_time", { ascending: false })
    .range(from, to);

  if (filters.type) {
    query = query.eq("type", filters.type);
  }
  if (filters.from) {
    query = query.gte("start_time", filters.from);
  }
  if (filters.to) {
    query = query.lte("start_time", filters.to);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function getActivity(
  supabase: SupabaseClient,
  id: string
): Promise<Activity> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateActivity(
  supabase: SupabaseClient,
  id: string,
  input: UpdateActivityInput
): Promise<Activity> {
  const { data, error } = await supabase
    .from("activities")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteActivity(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) throw error;
}
