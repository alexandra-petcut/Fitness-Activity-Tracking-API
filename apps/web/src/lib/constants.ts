import { ActivityType } from "@fitness/shared";

export const ACTIVITY_COLORS: Record<ActivityType, string> = {
  [ActivityType.RUN]: "#f97316",
  [ActivityType.BIKE]: "#3b82f6",
  [ActivityType.SWIM]: "#06b6d4",
  [ActivityType.WALK]: "#22c55e",
  [ActivityType.STRENGTH]: "#a855f7",
};

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  [ActivityType.RUN]: "Running",
  [ActivityType.BIKE]: "Cycling",
  [ActivityType.SWIM]: "Swimming",
  [ActivityType.WALK]: "Walking",
  [ActivityType.STRENGTH]: "Strength",
};

export const ACTIVITY_ICONS: Record<ActivityType, string> = {
  [ActivityType.RUN]: "footprints",
  [ActivityType.BIKE]: "bike",
  [ActivityType.SWIM]: "waves",
  [ActivityType.WALK]: "walking",
  [ActivityType.STRENGTH]: "dumbbell",
};
