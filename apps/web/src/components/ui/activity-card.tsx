"use client";

import Link from "next/link";
import type { Activity } from "@fitness/shared";
import {
  formatDuration,
  formatDistance,
  formatPace,
  calculatePace,
  ActivityType,
} from "@fitness/shared";
import { ACTIVITY_COLORS, ACTIVITY_LABELS } from "@/lib/constants";
import {
  Footprints,
  Bike,
  Waves,
  PersonStanding,
  Dumbbell,
  Clock,
  Flame,
  Ruler,
} from "lucide-react";

const ACTIVITY_ICON_MAP = {
  [ActivityType.RUN]: Footprints,
  [ActivityType.BIKE]: Bike,
  [ActivityType.SWIM]: Waves,
  [ActivityType.WALK]: PersonStanding,
  [ActivityType.STRENGTH]: Dumbbell,
};

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const color = ACTIVITY_COLORS[activity.type];
  const label = ACTIVITY_LABELS[activity.type];
  const Icon = ACTIVITY_ICON_MAP[activity.type];
  const date = new Date(activity.start_time);

  return (
    <Link href={`/activities/${activity.id}`}>
      <div className="group rounded-xl border border-border bg-bg-card p-5 transition hover:border-border-hover hover:bg-bg-card-hover">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <div className="font-semibold text-text-primary">{label}</div>
              <div className="text-xs text-text-muted">
                {date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}{" "}
                at{" "}
                {date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
          <div
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {label}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-text-muted" />
            <div>
              <div className="text-sm font-semibold text-text-primary">
                {formatDuration(activity.duration_sec)}
              </div>
              <div className="text-xs text-text-muted">Duration</div>
            </div>
          </div>

          {activity.distance_meters != null && activity.distance_meters > 0 && (
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-text-muted" />
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  {formatDistance(activity.distance_meters)}
                </div>
                <div className="text-xs text-text-muted">Distance</div>
              </div>
            </div>
          )}

          {activity.type === ActivityType.RUN &&
            activity.distance_meters != null &&
            activity.distance_meters > 0 && (
              <div className="flex items-center gap-2">
                <Footprints className="h-4 w-4 text-text-muted" />
                <div>
                  <div className="text-sm font-semibold text-text-primary">
                    {formatPace(
                      calculatePace(
                        activity.distance_meters,
                        activity.duration_sec
                      )
                    )}
                  </div>
                  <div className="text-xs text-text-muted">Pace</div>
                </div>
              </div>
            )}

          {activity.calories != null && activity.calories > 0 && (
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-text-muted" />
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  {activity.calories}
                </div>
                <div className="text-xs text-text-muted">Calories</div>
              </div>
            </div>
          )}
        </div>

        {activity.notes && (
          <p className="mt-3 truncate text-sm text-text-muted">
            {activity.notes}
          </p>
        )}
      </div>
    </Link>
  );
}
