"use client";

import { useState } from "react";
import { useAuth } from "@fitness/shared";
import { useRouter } from "next/navigation";
import { Activity, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-8">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-run/20">
          <Activity className="h-7 w-7 text-accent-run" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">
          Set new password
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Enter your new password below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Password updated! Redirecting to dashboard...</span>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={success}
              className="w-full rounded-lg border border-border bg-bg-input px-4 py-2.5 pr-10 text-text-primary placeholder-text-muted outline-none transition focus:border-accent-run focus:ring-1 focus:ring-accent-run disabled:opacity-50"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={success}
            className="w-full rounded-lg border border-border bg-bg-input px-4 py-2.5 text-text-primary placeholder-text-muted outline-none transition focus:border-accent-run focus:ring-1 focus:ring-accent-run disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full rounded-lg bg-accent-run px-4 py-2.5 font-semibold text-white transition hover:bg-accent-run/90 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
