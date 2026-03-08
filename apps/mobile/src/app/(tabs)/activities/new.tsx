import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useCreateActivity, ActivityType } from "@fitness/shared";
import type { CreateActivityInput } from "@fitness/shared";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/lib/theme";

const TYPES = Object.values(ActivityType);
const ACCENT_MAP: Record<string, string> = {
  [ActivityType.RUN]: colors.accent.run,
  [ActivityType.BIKE]: colors.accent.bike,
  [ActivityType.SWIM]: colors.accent.swim,
  [ActivityType.WALK]: colors.accent.walk,
  [ActivityType.STRENGTH]: colors.accent.strength,
};

export default function NewActivityScreen() {
  const router = useRouter();
  const createActivity = useCreateActivity(supabase);

  const [type, setType] = useState<ActivityType>(ActivityType.RUN);
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSave() {
    const totalSec = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
    if (totalSec <= 0) {
      Alert.alert("Error", "Duration must be greater than 0");
      return;
    }

    try {
      await createActivity.mutateAsync({
        type,
        start_time: new Date().toISOString(),
        duration_sec: totalSec,
        distance_meters: distanceKm ? parseFloat(distanceKm) * 1000 : null,
        calories: calories ? parseInt(calories) : null,
        notes: notes || null,
      });
      router.back();
    } catch (err: unknown) {
      Alert.alert("Error", err instanceof Error ? err.message : "Failed to save");
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Log Activity</Text>
        <TouchableOpacity onPress={handleSave} disabled={createActivity.isPending}>
          <Text style={[styles.saveText, createActivity.isPending && { opacity: 0.5 }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      {/* Type picker */}
      <Text style={styles.label}>Activity Type</Text>
      <View style={styles.typeRow}>
        {TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.typeChip,
              type === t && { backgroundColor: ACCENT_MAP[t], borderColor: ACCENT_MAP[t] },
            ]}
            onPress={() => setType(t)}
          >
            <Text
              style={[
                styles.typeChipText,
                type === t && { color: "#fff" },
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Duration */}
      <Text style={styles.label}>Duration</Text>
      <View style={styles.row}>
        <View style={styles.inputHalf}>
          <TextInput
            style={styles.input}
            value={minutes}
            onChangeText={setMinutes}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.text.muted}
          />
          <Text style={styles.inputSuffix}>min</Text>
        </View>
        <View style={styles.inputHalf}>
          <TextInput
            style={styles.input}
            value={seconds}
            onChangeText={setSeconds}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.text.muted}
          />
          <Text style={styles.inputSuffix}>sec</Text>
        </View>
      </View>

      {/* Distance */}
      {type !== ActivityType.STRENGTH && (
        <>
          <Text style={styles.label}>Distance (km)</Text>
          <TextInput
            style={styles.input}
            value={distanceKm}
            onChangeText={setDistanceKm}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.text.muted}
          />
        </>
      )}

      {/* Calories */}
      <Text style={styles.label}>Calories (optional)</Text>
      <TextInput
        style={styles.input}
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor={colors.text.muted}
      />

      {/* Notes */}
      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        placeholder="How was your workout?"
        placeholderTextColor={colors.text.muted}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  content: { padding: spacing.lg, paddingBottom: 100 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  cancelText: { color: colors.text.secondary, fontSize: 16 },
  title: { fontSize: 18, fontWeight: "bold", color: colors.text.primary },
  saveText: { color: colors.accent.run, fontSize: 16, fontWeight: "600" },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  typeRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg.card,
  },
  typeChipText: { fontSize: 13, fontWeight: "500", color: colors.text.secondary },
  row: { flexDirection: "row", gap: spacing.sm },
  inputHalf: { flex: 1, position: "relative" },
  input: {
    backgroundColor: colors.bg.input,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputSuffix: {
    position: "absolute",
    right: 12,
    top: 14,
    fontSize: 14,
    color: colors.text.muted,
  },
  textArea: { height: 80, textAlignVertical: "top" },
});
