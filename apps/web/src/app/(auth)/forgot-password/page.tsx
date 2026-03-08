"use client";

import { useState } from "react";
import { useAuth } from "@fitness/shared";
import Link from "next/link";
import { Activity, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
      await resetPassword(email, redirectTo);
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset link"
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
          Reset your password
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Enter your email and we&apos;ll send you a reset link
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
              <Mail className="h-4 w-4" />
              <span>Check your email for a password reset link.</span>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-bg-input px-4 py-2.5 text-text-primary placeholder-text-muted outline-none transition focus:border-accent-run focus:ring-1 focus:ring-accent-run"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent-run px-4 py-2.5 font-semibold text-white transition hover:bg-accent-run/90 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        <Link
          href="/login"
          className="font-medium text-accent-run hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
