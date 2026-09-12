import React, { useRef } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../../colors';

interface PinInputProps {
  value: string;
  onChangeText: (text: string) => void;
  length?: number;
}

export default function PinInput({ value, onChangeText, length = 5 }: PinInputProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      style={styles.linha}
    >
      {Array.from({ length }).map((_, i) => (
        <View key={i} style={[styles.caixa, i === value.length && styles.caixaAtiva]}>
          <Text style={styles.caixaTexto}>{value[i] ?? ''}</Text>
        </View>
      ))}

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(t) => onChangeText(t.slice(0, length).toUpperCase())}
        maxLength={length}
        autoCapitalize="characters"
        autoFocus
        style={styles.inputEscondido}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    gap: 10,
  },
  caixa: {
    width: 48,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caixaAtiva: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  caixaTexto: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  // opacity: 0 + tamanho 0 em vez de "display: none" — um input com
  // display none não consegue ganhar foco nem abrir o teclado
  inputEscondido: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
});
