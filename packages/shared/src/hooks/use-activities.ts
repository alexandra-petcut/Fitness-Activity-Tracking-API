"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
  ActivityFilters,
} from "../types/activity";
import {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../api/activities";

const ACTIVITIES_KEY = "activities";

export function useActivities(
  supabase: SupabaseClient,
  filters: ActivityFilters = {}
) {
  return useQuery({
    queryKey: [ACTIVITIES_KEY, filters],
    queryFn: () => getActivities(supabase, filters),
  });
}

export function useActivity(supabase: SupabaseClient, id: string) {
  return useQuery({
    queryKey: [ACTIVITIES_KEY, id],
    queryFn: () => getActivity(supabase, id),
    enabled: !!id,
  });
}

export function useCreateActivity(supabase: SupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateActivityInput) =>
      createActivity(supabase, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES_KEY] });
    },
  });
}

export function useUpdateActivity(supabase: SupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateActivityInput }) =>
      updateActivity(supabase, id, input),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES_KEY] });
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES_KEY, id] });
    },
  });
}

export function useDeleteActivity(supabase: SupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteActivity(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES_KEY] });
    },
  });
}
