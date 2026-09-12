import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type LucideIcon } from 'lucide-react-native';
import { colors } from '../../colors';

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
}

export default function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        <Icon color={iconColor} size={22} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
