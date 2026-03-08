import { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useActivities, formatDuration, formatDistance, ActivityType } from "@fitness/shared";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/lib/theme";

const ACCENT_MAP: Record<string, string> = {
  [ActivityType.RUN]: colors.accent.run,
  [ActivityType.BIKE]: colors.accent.bike,
  [ActivityType.SWIM]: colors.accent.swim,
  [ActivityType.WALK]: colors.accent.walk,
  [ActivityType.STRENGTH]: colors.accent.strength,
};

export default function MyDayScreen() {
  const { data, isLoading, refetch } = useActivities(supabase, { pageSize: 10 });
  const activities = data?.data ?? [];

  const weekStats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = activities.filter((a) => new Date(a.start_time) >= weekAgo);

    return {
      distance: thisWeek.reduce((s, a) => s + (a.distance_meters ?? 0), 0),
      duration: thisWeek.reduce((s, a) => s + a.duration_sec, 0),
      calories: thisWeek.reduce((s, a) => s + (a.calories ?? 0), 0),
      count: thisWeek.length,
    };
  }, [activities]);

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
      <Text style={styles.header}>My Day</Text>
      <Text style={styles.date}>
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </Text>

      {/* Weekly Summary Cards */}
      <View style={styles.grid}>
        <MetricTile
          label="Activities"
          value={String(weekStats.count)}
          color={colors.accent.run}
        />
        <MetricTile
          label="Distance"
          value={formatDistance(weekStats.distance)}
          color={colors.accent.bike}
        />
        <MetricTile
          label="Duration"
          value={formatDuration(weekStats.duration)}
          color={colors.accent.swim}
        />
        <MetricTile
          label="Calories"
          value={weekStats.calories > 0 ? String(weekStats.calories) : "—"}
          color={colors.accent.strength}
        />
      </View>

      {/* Recent Activities */}
      <Text style={styles.sectionTitle}>Recent Activities</Text>
      {activities.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No activities yet</Text>
          <Text style={styles.emptySubtext}>
            Log your first workout to get started
          </Text>
        </View>
      ) : (
        activities.slice(0, 5).map((a) => (
          <View key={a.id} style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: `${ACCENT_MAP[a.type]}33` },
                ]}
              >
                <Text style={[styles.typeBadgeText, { color: ACCENT_MAP[a.type] }]}>
                  {a.type}
                </Text>
              </View>
              <Text style={styles.activityDate}>
                {new Date(a.start_time).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>
            <View style={styles.activityMetrics}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>
                  {formatDuration(a.duration_sec)}
                </Text>
                <Text style={styles.metricLabel}>Duration</Text>
              </View>
              {a.distance_meters != null && a.distance_meters > 0 && (
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>
                    {formatDistance(a.distance_meters)}
                  </Text>
                  <Text style={styles.metricLabel}>Distance</Text>
                </View>
              )}
              {a.calories != null && a.calories > 0 && (
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{a.calories}</Text>
                  <Text style={styles.metricLabel}>Cal</Text>
                </View>
              )}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function MetricTile({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.tile}>
      <View style={[styles.tileAccent, { backgroundColor: `${color}33` }]}>
        <View style={[styles.tileDot, { backgroundColor: color }]} />
      </View>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
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
  },
  date: { fontSize: 14, color: colors.text.secondary, marginTop: 4, marginBottom: spacing.lg },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tile: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.bg.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tileAccent: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  tileDot: { width: 12, height: 12, borderRadius: 6 },
  tileValue: { fontSize: 20, fontWeight: "bold", color: colors.text.primary },
  tileLabel: { fontSize: 12, color: colors.text.secondary, marginTop: 2 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  emptyCard: {
    backgroundColor: colors.bg.card,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: { fontSize: 16, fontWeight: "600", color: colors.text.primary },
  emptySubtext: { fontSize: 14, color: colors.text.secondary, marginTop: 4 },
  activityCard: {
    backgroundColor: colors.bg.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  typeBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  typeBadgeText: { fontSize: 12, fontWeight: "600" },
  activityDate: { fontSize: 12, color: colors.text.muted },
  activityMetrics: { flexDirection: "row", gap: spacing.lg },
  metric: {},
  metricValue: { fontSize: 16, fontWeight: "bold", color: colors.text.primary },
  metricLabel: { fontSize: 11, color: colors.text.muted, marginTop: 2 },
});
