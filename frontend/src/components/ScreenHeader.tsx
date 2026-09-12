// src/components/ScreenHeader.tsx
//
// Cabeçalho repetido em várias telas: seta de voltar (opcional),
// título, e uma ação à direita — que às vezes é um texto ("Editar",
// "Salvar") e às vezes um ícone (o "+" de Médicos). Passa só o que
// a tela precisar; o que não passar, não desenha.

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, type LucideIcon } from 'lucide-react-native';
import { colors } from '../../colors';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void; // sem essa prop, não desenha a seta
  rightLabel?: string;
  RightIcon?: LucideIcon; // alternativa ao rightLabel
  onRightPress?: () => void;
}

export default function ScreenHeader({
  title,
  onBack,
  rightLabel,
  RightIcon,
  onRightPress,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.esquerda}>
        {onBack && (
          <TouchableOpacity onPress={onBack} hitSlop={8}>
            <ArrowLeft color={colors.textPrimary} size={24} />
          </TouchableOpacity>
        )}
        <Text style={styles.titulo}>{title}</Text>
      </View>

      {rightLabel && (
        <TouchableOpacity onPress={onRightPress}>
          <Text style={styles.acaoTexto}>{rightLabel}</Text>
        </TouchableOpacity>
      )}
      {RightIcon && (
        <TouchableOpacity onPress={onRightPress} hitSlop={8}>
          <RightIcon color={colors.primary} size={24} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  esquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  acaoTexto: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
});
