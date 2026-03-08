"use client";

import { useQuery } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import type { ActivityType } from "../types/activity";
import { getStatsSummary, getWeeklyStats, getPersonalBests } from "../api/stats";

export function useStatsSummary(
  api: AxiosInstance,
  params?: { from?: string; to?: string }
) {
  return useQuery({
    queryKey: ["stats", "summary", params],
    queryFn: () => getStatsSummary(api, params),
  });
}

export function useWeeklyStats(
  api: AxiosInstance,
  params?: { weeks?: number; type?: ActivityType }
) {
  return useQuery({
    queryKey: ["stats", "weekly", params],
    queryFn: () => getWeeklyStats(api, params),
  });
}

export function usePersonalBests(
  api: AxiosInstance,
  params?: { type?: ActivityType }
) {
  return useQuery({
    queryKey: ["stats", "personal-bests", params],
    queryFn: () => getPersonalBests(api, params),
  });
}
