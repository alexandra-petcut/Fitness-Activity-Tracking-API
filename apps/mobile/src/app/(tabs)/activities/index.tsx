import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import {
  useActivities,
  formatDuration,
  formatDistance,
  ActivityType,
} from "@fitness/shared";
import type { Activity } from "@fitness/shared";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/lib/theme";

const TYPES = [undefined, ...Object.values(ActivityType)] as const;
const TYPE_LABELS: Record<string, string> = {
  ALL: "All",
  RUN: "Run",
  BIKE: "Bike",
  SWIM: "Swim",
  WALK: "Walk",
  STRENGTH: "Strength",
};
const ACCENT_MAP: Record<string, string> = {
  [ActivityType.RUN]: colors.accent.run,
  [ActivityType.BIKE]: colors.accent.bike,
  [ActivityType.SWIM]: colors.accent.swim,
  [ActivityType.WALK]: colors.accent.walk,
  [ActivityType.STRENGTH]: colors.accent.strength,
};

export default function ActivitiesScreen() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<ActivityType | undefined>();
  const { data, isLoading, refetch } = useActivities(supabase, {
    type: typeFilter,
    pageSize: 50,
  });

  const activities = data?.data ?? [];

  function renderActivity({ item }: { item: Activity }) {
    const color = ACCENT_MAP[item.type] ?? colors.accent.run;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/(tabs)/activities/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.badge, { backgroundColor: `${color}33` }]}>
            <Text style={[styles.badgeText, { color }]}>{item.type}</Text>
          </View>
          <Text style={styles.dateText}>
            {new Date(item.start_time).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.metricsRow}>
          <View>
            <Text style={styles.metricValue}>
              {formatDuration(item.duration_sec)}
            </Text>
            <Text style={styles.metricLabel}>Duration</Text>
          </View>
          {item.distance_meters != null && item.distance_meters > 0 && (
            <View>
              <Text style={styles.metricValue}>
                {formatDistance(item.distance_meters)}
              </Text>
              <Text style={styles.metricLabel}>Distance</Text>
            </View>
          )}
          {item.calories != null && item.calories > 0 && (
            <View>
              <Text style={styles.metricValue}>{item.calories}</Text>
              <Text style={styles.metricLabel}>Cal</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Activities</Text>

      {/* Type filter chips */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={TYPES}
        keyExtractor={(item) => item ?? "ALL"}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item: type }) => (
          <TouchableOpacity
            style={[
              styles.chip,
              typeFilter === type && styles.chipActive,
              typeFilter === type && type && { backgroundColor: `${ACCENT_MAP[type]}33` },
            ]}
            onPress={() => setTypeFilter(type)}
          >
            <Text
              style={[
                styles.chipText,
                typeFilter === type && styles.chipTextActive,
                typeFilter === type && type && { color: ACCENT_MAP[type] },
              ]}
            >
              {TYPE_LABELS[type ?? "ALL"]}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Activity list */}
      <FlatList
        data={activities}
        renderItem={renderActivity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.accent.run}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No activities found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + spacing.md,
  },
  filterRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.bg.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { borderColor: colors.accent.run, backgroundColor: `${colors.accent.run}33` },
  chipText: { fontSize: 13, fontWeight: "500", color: colors.text.secondary },
  chipTextActive: { color: colors.accent.run },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  card: {
    backgroundColor: colors.bg.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: "600" },
  dateText: { fontSize: 12, color: colors.text.muted },
  metricsRow: { flexDirection: "row", gap: spacing.xl },
  metricValue: { fontSize: 16, fontWeight: "bold", color: colors.text.primary },
  metricLabel: { fontSize: 11, color: colors.text.muted, marginTop: 2 },
  empty: { padding: spacing.xl, alignItems: "center" },
  emptyText: { fontSize: 16, color: colors.text.secondary },
});
