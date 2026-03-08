"use client";

import { useAuth } from "@fitness/shared";
import { User, Mail, Calendar } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="mt-1 text-text-secondary">Manage your account</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Profile
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-run/20">
              <User className="h-5 w-5 text-accent-run" />
            </div>
            <div>
              <div className="text-sm text-text-muted">User ID</div>
              <div className="font-mono text-sm text-text-primary">
                {user?.id}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-bike/20">
              <Mail className="h-5 w-5 text-accent-bike" />
            </div>
            <div>
              <div className="text-sm text-text-muted">Email</div>
              <div className="text-sm text-text-primary">{user?.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-swim/20">
              <Calendar className="h-5 w-5 text-accent-swim" />
            </div>
            <div>
              <div className="text-sm text-text-muted">Member since</div>
              <div className="text-sm text-text-primary">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">About</h2>
        <div className="space-y-2 text-sm text-text-secondary">
          <p>FitTrack — Fitness Activity Tracker</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
