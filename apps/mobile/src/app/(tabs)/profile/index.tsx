import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { colors, spacing } from "@/lib/theme";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email?.[0]?.toUpperCase() ?? "?"}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.email}>{user?.email}</Text>
            <Text style={styles.since}>
              Member since{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About</Text>
        <Text style={styles.cardText}>FitTrack — Fitness Activity Tracker</Text>
        <Text style={styles.cardText}>Version 1.0.0</Text>
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary, padding: spacing.lg },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.bg.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.accent.run}33`,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "bold", color: colors.accent.run },
  info: { flex: 1 },
  email: { fontSize: 16, fontWeight: "500", color: colors.text.primary },
  since: { fontSize: 13, color: colors.text.muted, marginTop: 2 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: colors.text.primary, marginBottom: spacing.sm },
  cardText: { fontSize: 14, color: colors.text.secondary, marginBottom: 4 },
  signOutBtn: {
    backgroundColor: `${colors.error}1A`,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: `${colors.error}4D`,
    marginTop: spacing.md,
  },
  signOutText: { color: colors.error, fontSize: 16, fontWeight: "600" },
});
