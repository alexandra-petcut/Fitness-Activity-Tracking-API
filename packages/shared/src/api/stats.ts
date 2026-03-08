import type { AxiosInstance } from "axios";
import type { ActivityType } from "../types/activity";
import type { StatsSummary, WeeklyStats, PersonalBests } from "../types/stats";

export async function getStatsSummary(
  api: AxiosInstance,
  params?: { from?: string; to?: string }
): Promise<StatsSummary> {
  const { data } = await api.get<StatsSummary>("/api/stats/summary", {
    params,
  });
  return data;
}

export async function getWeeklyStats(
  api: AxiosInstance,
  params?: { weeks?: number; type?: ActivityType }
): Promise<WeeklyStats[]> {
  const { data } = await api.get<WeeklyStats[]>("/api/stats/weekly", {
    params,
  });
  return data;
}

export async function getPersonalBests(
  api: AxiosInstance,
  params?: { type?: ActivityType }
): Promise<PersonalBests> {
  const { data } = await api.get<PersonalBests>("/api/stats/personal-bests", {
    params,
  });
  return data;
}
