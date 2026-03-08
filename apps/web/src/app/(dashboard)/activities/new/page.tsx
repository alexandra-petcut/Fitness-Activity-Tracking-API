"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateActivity, ActivityType } from "@fitness/shared";
import type { CreateActivityInput } from "@fitness/shared";
import { createClient } from "@/lib/supabase";
import { ACTIVITY_COLORS, ACTIVITY_LABELS } from "@/lib/constants";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const supabase = createClient();

export default function NewActivityPage() {
  const router = useRouter();
  const createActivity = useCreateActivity(supabase);

  const [form, setForm] = useState<CreateActivityInput>({
    type: ActivityType.RUN,
    start_time: new Date().toISOString().slice(0, 16),
    duration_sec: 0,
    distance_meters: null,
    calories: null,
    notes: null,
  });

  const [durationMinutes, setDurationMinutes] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const totalSeconds = durationMinutes * 60 + durationSeconds;
    if (totalSeconds <= 0) {
      setError("Duration must be greater than 0");
      return;
    }

    try {
      await createActivity.mutateAsync({
        ...form,
        start_time: new Date(form.start_time).toISOString(),
        duration_sec: totalSeconds,
        distance_meters: distanceKm ? parseFloat(distanceKm) * 1000 : null,
      });
      router.push("/activities");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create activity"
      );
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/activities"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-secondary transition hover:bg-bg-card hover:text-text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Log Activity</h1>
          <p className="mt-1 text-text-secondary">Record a new workout</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-border bg-bg-card p-6"
      >
        {error && (
          <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        {/* Activity Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            Activity Type
          </label>
          <div className="grid grid-cols-5 gap-2">
            {Object.values(ActivityType).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type }))}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                  form.type === type
                    ? "border-transparent text-white"
                    : "border-border text-text-secondary hover:border-border-hover"
                }`}
                style={
                  form.type === type
                    ? { backgroundColor: ACTIVITY_COLORS[type] }
                    : undefined
                }
              >
                {ACTIVITY_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div>
          <label
            htmlFor="start_time"
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            Date & Time
          </label>
          <input
            id="start_time"
            type="datetime-local"
            value={form.start_time}
            onChange={(e) =>
              setForm((f) => ({ ...f, start_time: e.target.value }))
            }
            required
            className="w-full rounded-lg border border-border bg-bg-input px-4 py-2.5 text-text-primary outline-none transition focus:border-accent-run focus:ring-1 focus:ring-accent-run [color-scheme:dark]"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Duration
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={durationMinutes || ""}
                  onChange={(e) =>
                    setDurationMinutes(parseInt(e.target.value) || 0)
                  }
                  placeholder="0"
                  className="w-full rounded-lg border border-border bg-bg-input px-4 py-2.5 pr-14 text-text-primary outline-none transition focus:border-accent-run focus:ring-1 focus:ring-accent-run"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                  min
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={durationSeconds || ""}
                  onChange={(e) =>
                    setDurationSeconds(parseInt(e.target.value) || 0)
                  }
                  placeholder="0"
                  className="w-full rounded-lg border border-border bg-bg-input px-4 py-2.5 pr-14 text-text-primary outline-none transition focus:border-accent-run focus:ring-1 focus:ring-accent-run"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                  sec
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Distance */}
        {form.type !== ActivityType.STRENGTH && (
          <div>
            <label
              htmlFor="distance"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Distance (km)
            </label>
            <input
              id="distance"
              type="number"
              step="0.01"
              min="0"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-border bg-bg-input px-4 py-2.5 text-text-primary outline-none transition focus:border-accent-run focus:ring-1 focus:ring-accent-run"
            />
          </div>
        )}

        {/* Calories */}
        <div>
          <label
            htmlFor="calories"
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            Calories (optional)
          </label>
          <input
            id="calories"
            type="number"
            min="0"
            value={form.calories ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                calories: e.target.value ? parseInt(e.target.value) : null,
              }))
            }
            placeholder="0"
            className="w-full rounded-lg border border-border bg-bg-input px-4 py-2.5 text-text-primary outline-none transition focus:border-accent-run focus:ring-1 focus:ring-accent-run"
          />
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={form.notes ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                notes: e.target.value || null,
              }))
            }
            rows={3}
            placeholder="How was your workout?"
            className="w-full resize-none rounded-lg border border-border bg-bg-input px-4 py-2.5 text-text-primary placeholder-text-muted outline-none transition focus:border-accent-run focus:ring-1 focus:ring-accent-run"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={createActivity.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-run px-4 py-3 font-semibold text-white transition hover:bg-accent-run/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {createActivity.isPending ? "Saving..." : "Save Activity"}
        </button>
      </form>
    </div>
  );
}
