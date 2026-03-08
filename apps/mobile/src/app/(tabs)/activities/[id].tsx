import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useActivity,
  useDeleteActivity,
  formatDuration,
  formatDistance,
  formatPace,
  calculatePace,
  ActivityType,
} from "@fitness/shared";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/lib/theme";

const ACCENT_MAP: Record<string, string> = {
  [ActivityType.RUN]: colors.accent.run,
  [ActivityType.BIKE]: colors.accent.bike,
  [ActivityType.SWIM]: colors.accent.swim,
  [ActivityType.WALK]: colors.accent.walk,
  [ActivityType.STRENGTH]: colors.accent.strength,
};

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: activity, isLoading } = useActivity(supabase, id!);
  const deleteActivity = useDeleteActivity(supabase);

  function handleDelete() {
    Alert.alert("Delete Activity", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteActivity.mutateAsync(id!);
          router.back();
        },
      },
    ]);
  }

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Activity not found</Text>
      </View>
    );
  }

  const color = ACCENT_MAP[activity.type] ?? colors.accent.run;
  const pace =
    activity.distance_meters && activity.distance_meters > 0
      ? calculatePace(activity.distance_meters, activity.duration_sec)
      : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.typeBadge, { backgroundColor: `${color}33` }]}>
        <Text style={[styles.typeBadgeText, { color }]}>{activity.type}</Text>
      </View>

      <Text style={styles.date}>
        {new Date(activity.start_time).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>

      {/* Metrics */}
      <View style={styles.metricsGrid}>
        <MetricTile label="Duration" value={formatDuration(activity.duration_sec)} color={color} />
        {activity.distance_meters != null && activity.distance_meters > 0 && (
          <MetricTile label="Distance" value={formatDistance(activity.distance_meters)} color={color} />
        )}
        {pace && activity.type === ActivityType.RUN && (
          <MetricTile label="Pace" value={formatPace(pace)} color={color} />
        )}
        {activity.calories != null && activity.calories > 0 && (
          <MetricTile label="Calories" value={`${activity.calories} kcal`} color={colors.accent.hr} />
        )}
      </View>

      {activity.notes && (
        <View style={styles.notesCard}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notesText}>{activity.notes}</Text>
        </View>
      )}
    </ScrollView>
  );
}

function MetricTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={[styles.tileValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  content: { padding: spacing.lg, paddingBottom: 100 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg.primary },
  loadingText: { color: colors.text.secondary, fontSize: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  backBtn: { padding: spacing.sm },
  backText: { color: colors.accent.run, fontSize: 16, fontWeight: "500" },
  deleteText: { color: colors.error, fontSize: 14, fontWeight: "500" },
  typeBadge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: spacing.sm,
  },
  typeBadgeText: { fontSize: 14, fontWeight: "600" },
  date: { fontSize: 14, color: colors.text.secondary, marginBottom: spacing.lg },
  metricsGrid: {
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
  tileLabel: { fontSize: 12, color: colors.text.muted, marginBottom: 4 },
  tileValue: { fontSize: 22, fontWeight: "bold" },
  notesCard: {
    backgroundColor: colors.bg.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesLabel: { fontSize: 12, color: colors.text.muted, marginBottom: spacing.sm },
  notesText: { fontSize: 14, color: colors.text.primary, lineHeight: 20 },
});
