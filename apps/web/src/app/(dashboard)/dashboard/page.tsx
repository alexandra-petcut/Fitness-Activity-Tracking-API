"use client";

import { useActivities, ActivityType, formatDuration, formatDistance } from "@fitness/shared";
import { createClient } from "@/lib/supabase";
import { MetricCard } from "@/components/ui/metric-card";
import { ActivityCard } from "@/components/ui/activity-card";
import { CircularProgress } from "@/components/charts/circular-progress";
import { ACTIVITY_COLORS } from "@/lib/constants";
import { useMemo } from "react";
import {
  Footprints,
  Bike,
  Waves,
  Clock,
  Flame,
  Ruler,
  TrendingUp,
  Plus,
} from "lucide-react";
import Link from "next/link";

const supabase = createClient();

export default function DashboardPage() {
  const { data, isLoading } = useActivities(supabase, { pageSize: 5 });

  const recentActivities = data?.data ?? [];
  const totalCount = data?.count ?? 0;

  const weekStats = useMemo(() => {
    if (!recentActivities.length)
      return { distance: 0, duration: 0, calories: 0, count: 0 };

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeek = recentActivities.filter(
      (a) => new Date(a.start_time) >= weekAgo
    );

    return {
      distance: thisWeek.reduce((sum, a) => sum + (a.distance_meters ?? 0), 0),
      duration: thisWeek.reduce((sum, a) => sum + a.duration_sec, 0),
      calories: thisWeek.reduce((sum, a) => sum + (a.calories ?? 0), 0),
      count: thisWeek.length,
    };
  }, [recentActivities]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-run border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="mt-1 text-text-secondary">
            Your fitness overview at a glance
          </p>
        </div>
        <Link
          href="/activities/new"
          className="flex items-center gap-2 rounded-lg bg-accent-run px-4 py-2.5 font-semibold text-white transition hover:bg-accent-run/90"
        >
          <Plus className="h-4 w-4" />
          Log Activity
        </Link>
      </div>

      {/* This Week Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Activities"
          value={String(weekStats.count)}
          subtitle="This week"
          icon={TrendingUp}
          accentColor={ACTIVITY_COLORS[ActivityType.RUN]}
        />
        <MetricCard
          label="Distance"
          value={formatDistance(weekStats.distance)}
          subtitle="This week"
          icon={Ruler}
          accentColor={ACTIVITY_COLORS[ActivityType.BIKE]}
        />
        <MetricCard
          label="Duration"
          value={formatDuration(weekStats.duration)}
          subtitle="This week"
          icon={Clock}
          accentColor={ACTIVITY_COLORS[ActivityType.SWIM]}
        />
        <MetricCard
          label="Calories"
          value={weekStats.calories > 0 ? `${weekStats.calories}` : "—"}
          subtitle="This week"
          icon={Flame}
          accentColor={ACTIVITY_COLORS[ActivityType.STRENGTH]}
        />
      </div>

      {/* Activity Goals (circular progress) */}
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold text-text-primary">
          Weekly Goals
        </h2>
        <div className="flex flex-wrap items-center justify-around gap-6">
          <CircularProgress
            value={weekStats.count}
            max={5}
            color={ACTIVITY_COLORS[ActivityType.RUN]}
            label="Activities"
            displayValue={`${weekStats.count}/5`}
          />
          <CircularProgress
            value={Math.round(weekStats.distance / 1000)}
            max={30}
            color={ACTIVITY_COLORS[ActivityType.BIKE]}
            label="Distance (km)"
            displayValue={`${Math.round(weekStats.distance / 1000)}/30`}
          />
          <CircularProgress
            value={Math.round(weekStats.duration / 60)}
            max={300}
            color={ACTIVITY_COLORS[ActivityType.SWIM]}
            label="Minutes"
            displayValue={`${Math.round(weekStats.duration / 60)}/300`}
          />
          <CircularProgress
            value={weekStats.calories}
            max={2000}
            color={ACTIVITY_COLORS[ActivityType.STRENGTH]}
            label="Calories"
            displayValue={`${weekStats.calories}`}
          />
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            Recent Activities
          </h2>
          {totalCount > 5 && (
            <Link
              href="/activities"
              className="text-sm text-accent-run hover:underline"
            >
              View all ({totalCount})
            </Link>
          )}
        </div>

        {recentActivities.length === 0 ? (
          <div className="rounded-xl border border-border bg-bg-card p-12 text-center">
            <Footprints className="mx-auto mb-4 h-12 w-12 text-text-muted" />
            <h3 className="text-lg font-semibold text-text-primary">
              No activities yet
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              Log your first workout to get started
            </p>
            <Link
              href="/activities/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent-run px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-run/90"
            >
              <Plus className="h-4 w-4" />
              Log Activity
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
