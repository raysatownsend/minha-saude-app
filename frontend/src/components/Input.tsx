import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../../colors';

type IconComponent = React.ComponentType<{ color?: string; size?: number }>;

type InputProps = TextInputProps & {
  label: string;
  icon: IconComponent;
  secureTextEntry?: boolean;
};

export default function Input({
  label,
  icon: Icon, // precisa começar com maiúscula pra virar <Icon /> no JSX
  secureTextEntry = false,
  ...textInputProps // sobra tudo (placeholder, value, onChangeText, autoCapitalize...)
}: InputProps) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const esconderTexto = secureTextEntry && !mostrarSenha;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        {Icon && <Icon color={colors.primary} size={20} />}
        <TextInput
          style={styles.inputText}
          placeholderTextColor={colors.textSecondary}
          {...textInputProps}
          secureTextEntry={esconderTexto}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            {mostrarSenha ? (
              <EyeOff color={colors.textSecondary} size={20} />
            ) : (
              <Eye color={colors.textSecondary} size={20} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
});