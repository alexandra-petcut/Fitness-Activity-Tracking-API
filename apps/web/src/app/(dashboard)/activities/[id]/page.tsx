"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useActivity,
  useDeleteActivity,
  formatDuration,
  formatDistance,
  formatPace,
  formatSpeed,
  calculatePace,
  ActivityType,
} from "@fitness/shared";
import { createClient } from "@/lib/supabase";
import { ACTIVITY_COLORS, ACTIVITY_LABELS } from "@/lib/constants";
import { MetricCard } from "@/components/ui/metric-card";
import {
  ArrowLeft,
  Trash2,
  Clock,
  Ruler,
  Flame,
  Footprints,
  Gauge,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const supabase = createClient();

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: activity, isLoading } = useActivity(supabase, id);
  const deleteActivity = useDeleteActivity(supabase);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleDelete() {
    await deleteActivity.mutateAsync(id);
    router.push("/activities");
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-run border-t-transparent" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="text-center text-text-secondary">Activity not found</div>
    );
  }

  const color = ACTIVITY_COLORS[activity.type];
  const label = ACTIVITY_LABELS[activity.type];
  const date = new Date(activity.start_time);
  const pace =
    activity.distance_meters && activity.distance_meters > 0
      ? calculatePace(activity.distance_meters, activity.duration_sec)
      : null;
  const speedMps =
    activity.distance_meters && activity.duration_sec > 0
      ? activity.distance_meters / activity.duration_sec
      : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/activities"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-secondary transition hover:bg-bg-card hover:text-text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-text-primary">{label}</h1>
              <span
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {label}
              </span>
            </div>
            <p className="mt-1 text-text-secondary">
              <Calendar className="mr-1 inline h-4 w-4" />
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              at{" "}
              {date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition hover:border-error/50 hover:bg-error/10 hover:text-error"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Duration"
          value={formatDuration(activity.duration_sec)}
          icon={Clock}
          accentColor={color}
        />
        {activity.distance_meters != null && activity.distance_meters > 0 && (
          <MetricCard
            label="Distance"
            value={formatDistance(activity.distance_meters)}
            icon={Ruler}
            accentColor={color}
          />
        )}
        {pace && activity.type === ActivityType.RUN && (
          <MetricCard
            label="Pace"
            value={formatPace(pace)}
            icon={Footprints}
            accentColor={color}
          />
        )}
        {speedMps && activity.type !== ActivityType.RUN && (
          <MetricCard
            label="Speed"
            value={formatSpeed(speedMps)}
            icon={Gauge}
            accentColor={color}
          />
        )}
        {activity.calories != null && activity.calories > 0 && (
          <MetricCard
            label="Calories"
            value={`${activity.calories} kcal`}
            icon={Flame}
            accentColor="#ef4444"
          />
        )}
      </div>

      {/* Notes */}
      {activity.notes && (
        <div className="rounded-xl border border-border bg-bg-card p-6">
          <h2 className="mb-3 text-sm font-medium text-text-secondary">
            Notes
          </h2>
          <p className="text-text-primary">{activity.notes}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl border border-border bg-bg-card p-6">
            <h3 className="text-lg font-semibold text-text-primary">
              Delete Activity?
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              This action cannot be undone. This will permanently delete this{" "}
              {label.toLowerCase()} activity.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-card-hover"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteActivity.isPending}
                className="flex-1 rounded-lg bg-error px-4 py-2 text-sm font-medium text-white transition hover:bg-error/90 disabled:opacity-50"
              >
                {deleteActivity.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
