"use client";

import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  accentColor?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  accentColor = "#f97316",
  className,
}: MetricCardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-border bg-bg-card p-5 transition hover:border-border-hover",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">{label}</span>
        {Icon && (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <Icon className="h-4 w-4" style={{ color: accentColor }} />
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-text-primary">{value}</div>
      {subtitle && (
        <div className="mt-1 text-sm text-text-muted">{subtitle}</div>
      )}
    </div>
  );
}
