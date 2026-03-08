import type { ActivityType } from "./activity";

export interface StatsSummary {
  total_activities: number;
  total_distance_meters: number;
  total_duration_sec: number;
  total_calories: number;
  by_type: Record<
    ActivityType,
    {
      count: number;
      distance_meters: number;
      duration_sec: number;
      calories: number;
    }
  >;
}

export interface WeeklyStats {
  week_start: string;
  week_number: number;
  year: number;
  count: number;
  distance_meters: number;
  duration_sec: number;
  calories: number;
}

export interface PersonalBest {
  metric: string;
  value: number;
  unit: string;
  activity_id: string;
  achieved_at: string;
}

export interface PersonalBests {
  type: ActivityType;
  bests: PersonalBest[];
}
