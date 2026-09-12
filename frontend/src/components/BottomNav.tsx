import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Home, HeartPulse, QrCode, User, type LucideIcon } from 'lucide-react-native';
import { colors } from '../../colors';

export type NavTab = 'inicio' | 'clinico' | 'qrcode' | 'perfil';

interface BottomNavProps {
  active: NavTab;
  onNavigate?: (tab: NavTab) => void;
}

const TABS: { key: NavTab; label: string; icon: LucideIcon }[] = [
  { key: 'inicio', label: 'Início', icon: Home },
  { key: 'clinico', label: 'Clínico', icon: HeartPulse },
  { key: 'qrcode', label: 'QR Code', icon: QrCode },
  { key: 'perfil', label: 'Perfil', icon: User },
];

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <View style={styles.container}>
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = key === active;
        const cor = isActive ? colors.primary : colors.textSecondary;
        return (
          <TouchableOpacity
            key={key}
            style={styles.tab}
            onPress={() => onNavigate?.(key)}
          >
            <Icon color={cor} size={22} />
            <Text style={[styles.label, { color: cor }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.card,
    paddingTop: 10,
    paddingBottom: 24,
    backgroundColor: colors.background,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
