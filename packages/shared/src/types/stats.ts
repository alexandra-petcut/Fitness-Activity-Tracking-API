import type { ActivityType } from "./activity";

export interface StatsSummary {
  totalActivities: number;
  totalDistanceMeters: number;
  totalDurationSec: number;
  totalCalories: number;
  byType: Record<
    ActivityType,
    {
      count: number;
      distance: number;
      duration: number;
      calories: number;
    }
  >;
}

export interface WeeklyStats {
  weekStart: string;
  weekNumber: number;
  year: number;
  count: number;
  distanceMeters: number;
  durationSec: number;
  calories: number;
}

export interface PersonalBest {
  metric: string;
  value: number;
  unit: string;
  activityId: string;
  achievedAt: string;
}

export interface PersonalBests {
  type: ActivityType;
  bests: PersonalBest[];
}
