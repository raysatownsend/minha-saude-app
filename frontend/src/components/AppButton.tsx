import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { type LucideIcon } from 'lucide-react-native';
import { colors } from '../../colors';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';

// extends TouchableOpacityProps: mesmo truque do Input.tsx com
// TextInputProps — herda onPress, disabled, etc. de graça, sem
// precisar redeclarar cada um.
interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: LucideIcon;
  variant?: ButtonVariant;
}

export default function AppButton({
  title,
  icon: Icon, 
  variant = 'primary',
  style,
  disabled,
  ...touchableProps
}: AppButtonProps) {
  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      style={[styles.base, v.container, disabled && styles.desabilitado, style]}
      activeOpacity={0.8}
      {...touchableProps}
    >
      {Icon && <Icon color={v.text.color} size={20} />}
      <Text style={[styles.text, v.text]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  desabilitado: {
    opacity: 0.5,
  },
});

const variantStyles: Record<
  ButtonVariant,
  { container: object; text: { color: string } }
> = {
  primary: {
    container: { backgroundColor: colors.primary },
    text: { color: colors.textPrimary },
  },
  secondary: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    text: { color: colors.primary },
  },
  success: {
    container: { backgroundColor: colors.success },
    text: { color: colors.textPrimary },
  },
  danger: {
    container: { backgroundColor: colors.dangerLight },
    text: { color: colors.danger },
  },
};