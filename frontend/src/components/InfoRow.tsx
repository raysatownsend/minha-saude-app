// src/components/InfoRow.tsx
//
// Linha usada no "Resumo clínico" da Home e em "Meus médicos" —
// ícone à esquerda, título e subtítulo empilhados no meio, e agora
// um ícone de ação OPCIONAL à direita (o telefone verde/vermelho
// de Médicos). Continua reaproveitável nas telas que só precisam
// do ícone + texto, já que actionIcon não é obrigatório.

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type LucideIcon } from 'lucide-react-native';
import { colors } from '../../colors';

interface InfoRowProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  actionIcon?: LucideIcon;
  actionColor?: string;
  onAction?: () => void;
}

export default function InfoRow({
  icon: Icon,
  title,
  subtitle,
  actionIcon: ActionIcon,
  actionColor = colors.primary,
  onAction,
}: InfoRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconCircle}>
        <Icon color={colors.primary} size={20} />
      </View>
      <View style={styles.textos}>
        <Text style={styles.titulo}>{title}</Text>
        <Text style={styles.subtitulo}>{subtitle}</Text>
      </View>
      {ActionIcon && (
        <TouchableOpacity onPress={onAction} hitSlop={8}>
          <ActionIcon color={actionColor} size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textos: {
    flex: 1,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitulo: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
