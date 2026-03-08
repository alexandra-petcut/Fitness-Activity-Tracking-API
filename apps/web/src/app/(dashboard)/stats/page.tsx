"use client";

import { useState } from "react";
import {
  useStatsSummary,
  useWeeklyStats,
  usePersonalBests,
  ActivityType,
  formatDuration,
  formatDistance,
  formatPace,
} from "@fitness/shared";
import { getSpringApi } from "@/lib/spring-api";
import { MetricCard } from "@/components/ui/metric-card";
import { WeeklyBarChart } from "@/components/charts/weekly-bar-chart";
import { ACTIVITY_COLORS, ACTIVITY_LABELS } from "@/lib/constants";
import {
  TrendingUp,
  Ruler,
  Clock,
  Flame,
  Trophy,
  BarChart3,
} from "lucide-react";

const api = getSpringApi();

export default function StatsPage() {
  const [selectedType, setSelectedType] = useState<ActivityType | undefined>();

  const { data: summary, isLoading: summaryLoading } = useStatsSummary(api);
  const { data: weekly, isLoading: weeklyLoading } = useWeeklyStats(api, {
    weeks: 12,
    type: selectedType,
  });
  const { data: personalBests, isLoading: pbLoading } = usePersonalBests(api, {
    type: selectedType ?? ActivityType.RUN,
  });

  const weeklyChartData = (weekly ?? []).map((w) => ({
    label: `W${w.week_number}`,
    value: w.distance_meters / 1000,
  }));

  const isLoading = summaryLoading || weeklyLoading;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Statistics</h1>
        <p className="mt-1 text-text-secondary">
          Your fitness analytics and personal records
        </p>
      </div>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedType(undefined)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            !selectedType
              ? "bg-accent-run/20 text-accent-run"
              : "text-text-secondary hover:bg-bg-card"
          }`}
        >
          All Types
        </button>
        {Object.values(ActivityType).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition`}
            style={
              selectedType === type
                ? {
                    backgroundColor: `${ACTIVITY_COLORS[type]}20`,
                    color: ACTIVITY_COLORS[type],
                  }
                : undefined
            }
          >
            {ACTIVITY_LABELS[type]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-run border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          {summary && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Total Activities"
                value={String(summary.total_activities)}
                icon={TrendingUp}
                accentColor={ACTIVITY_COLORS[ActivityType.RUN]}
              />
              <MetricCard
                label="Total Distance"
                value={formatDistance(summary.total_distance_meters)}
                icon={Ruler}
                accentColor={ACTIVITY_COLORS[ActivityType.BIKE]}
              />
              <MetricCard
                label="Total Duration"
                value={formatDuration(summary.total_duration_sec)}
                icon={Clock}
                accentColor={ACTIVITY_COLORS[ActivityType.SWIM]}
              />
              <MetricCard
                label="Total Calories"
                value={
                  summary.total_calories > 0
                    ? `${summary.total_calories}`
                    : "—"
                }
                icon={Flame}
                accentColor={ACTIVITY_COLORS[ActivityType.STRENGTH]}
              />
            </div>
          )}

          {/* Weekly Distance Chart */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-text-secondary" />
              <h2 className="text-lg font-semibold text-text-primary">
                Weekly Distance
              </h2>
            </div>
            {weeklyChartData.length > 0 ? (
              <WeeklyBarChart
                data={weeklyChartData}
                color={
                  selectedType
                    ? ACTIVITY_COLORS[selectedType]
                    : ACTIVITY_COLORS[ActivityType.RUN]
                }
                unit="km"
              />
            ) : (
              <div className="rounded-xl border border-border bg-bg-card p-12 text-center text-text-secondary">
                No data for the selected period
              </div>
            )}
          </div>

          {/* Personal Bests */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-warning" />
              <h2 className="text-lg font-semibold text-text-primary">
                Personal Bests
              </h2>
            </div>
            {pbLoading ? (
              <div className="flex h-24 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-run border-t-transparent" />
              </div>
            ) : personalBests && personalBests.bests.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {personalBests.bests.map((best) => (
                  <div
                    key={best.metric}
                    className="rounded-xl border border-border bg-bg-card p-5"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium text-text-secondary">
                        {best.metric}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-text-primary">
                      {best.metric.toLowerCase().includes("pace")
                        ? formatPace(best.value)
                        : best.metric.toLowerCase().includes("distance")
                          ? formatDistance(best.value)
                          : `${best.value.toFixed(1)} ${best.unit}`}
                    </div>
                    <div className="mt-1 text-xs text-text-muted">
                      {new Date(best.achieved_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-bg-card p-8 text-center text-text-secondary">
                Complete more activities to unlock personal bests
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
