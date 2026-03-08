import { View, Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
import {
  useStatsSummary,
  usePersonalBests,
  formatDuration,
  formatDistance,
  formatPace,
  ActivityType,
} from "@fitness/shared";
import { createSpringApiClient } from "@fitness/shared";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/lib/theme";

const api = createSpringApiClient(
  supabase,
  process.env.EXPO_PUBLIC_SPRING_API_URL
);

export default function StatsScreen() {
  const { data: summary, isLoading, refetch } = useStatsSummary(api);
  const { data: personalBests } = usePersonalBests(api, {
    type: ActivityType.RUN,
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          tintColor={colors.accent.run}
        />
      }
    >
      <Text style={styles.header}>Statistics</Text>

      {summary ? (
        <View style={styles.grid}>
          <StatCard
            label="Total Activities"
            value={String(summary.total_activities)}
            color={colors.accent.run}
          />
          <StatCard
            label="Total Distance"
            value={formatDistance(summary.total_distance_meters)}
            color={colors.accent.bike}
          />
          <StatCard
            label="Total Duration"
            value={formatDuration(summary.total_duration_sec)}
            color={colors.accent.swim}
          />
          <StatCard
            label="Total Calories"
            value={summary.total_calories > 0 ? String(summary.total_calories) : "—"}
            color={colors.accent.strength}
          />
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            {isLoading ? "Loading stats..." : "No stats available yet"}
          </Text>
        </View>
      )}

      {/* Personal Bests */}
      <Text style={styles.sectionTitle}>Personal Bests</Text>
      {personalBests && personalBests.bests.length > 0 ? (
        personalBests.bests.map((best) => (
          <View key={best.metric} style={styles.pbCard}>
            <Text style={styles.pbMetric}>🏆 {best.metric}</Text>
            <Text style={styles.pbValue}>
              {best.metric.toLowerCase().includes("pace")
                ? formatPace(best.value)
                : best.metric.toLowerCase().includes("distance")
                  ? formatDistance(best.value)
                  : `${best.value.toFixed(1)} ${best.unit}`}
            </Text>
            <Text style={styles.pbDate}>
              {new Date(best.achieved_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Complete more activities to unlock personal bests
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statDot, { backgroundColor: color }]} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  content: { padding: spacing.lg, paddingBottom: 100 },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.lg },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.bg.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statDot: { width: 8, height: 8, borderRadius: 4, marginBottom: spacing.sm },
  statValue: { fontSize: 20, fontWeight: "bold", color: colors.text.primary },
  statLabel: { fontSize: 12, color: colors.text.secondary, marginTop: 2 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  pbCard: {
    backgroundColor: colors.bg.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pbMetric: { fontSize: 13, color: colors.text.secondary, marginBottom: 4 },
  pbValue: { fontSize: 22, fontWeight: "bold", color: colors.warning },
  pbDate: { fontSize: 11, color: colors.text.muted, marginTop: 4 },
  emptyCard: {
    backgroundColor: colors.bg.card,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  emptyText: { color: colors.text.secondary, fontSize: 14 },
});
