"use client";

import { useState } from "react";
import { useActivities, ActivityType } from "@fitness/shared";
import type { ActivityFilters } from "@fitness/shared";
import { createClient } from "@/lib/supabase";
import { ActivityCard } from "@/components/ui/activity-card";
import { ACTIVITY_LABELS } from "@/lib/constants";
import { Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const supabase = createClient();
const PAGE_SIZE = 10;

export default function ActivitiesPage() {
  const [filters, setFilters] = useState<ActivityFilters>({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const { data, isLoading } = useActivities(supabase, filters);

  const activities = data?.data ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const currentPage = filters.page ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Activities</h1>
          <p className="mt-1 text-text-secondary">
            {totalCount} total activities
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Filter className="h-4 w-4" />
          Type:
        </div>
        <button
          onClick={() => setFilters((f) => ({ ...f, type: undefined, page: 0 }))}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            !filters.type
              ? "bg-accent-run/20 text-accent-run"
              : "text-text-secondary hover:bg-bg-card"
          }`}
        >
          All
        </button>
        {Object.values(ActivityType).map((type) => (
          <button
            key={type}
            onClick={() => setFilters((f) => ({ ...f, type, page: 0 }))}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              filters.type === type
                ? "bg-accent-run/20 text-accent-run"
                : "text-text-secondary hover:bg-bg-card"
            }`}
          >
            {ACTIVITY_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Activity List */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-run border-t-transparent" />
        </div>
      ) : activities.length === 0 ? (
        <div className="rounded-xl border border-border bg-bg-card p-12 text-center">
          <p className="text-text-secondary">
            No activities found. Try a different filter or log a new activity.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() =>
              setFilters((f) => ({ ...f, page: Math.max(0, currentPage - 1) }))
            }
            disabled={currentPage === 0}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-bg-card disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-sm text-text-secondary">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() =>
              setFilters((f) => ({
                ...f,
                page: Math.min(totalPages - 1, currentPage + 1),
              }))
            }
            disabled={currentPage >= totalPages - 1}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-bg-card disabled:opacity-30"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
