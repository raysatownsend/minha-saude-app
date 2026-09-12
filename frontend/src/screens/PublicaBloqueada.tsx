import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text } from 'react-native';
import PinInput from '../components/PinInput';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';

const TAMANHO_SENHA = 5;

export default function PublicaBloqueada() {
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/icon.png')} style={styles.logo} />

      <Text style={styles.titulo}>Dados de saúde protegidos</Text>
      <Text style={styles.subtitulo}>
        Informe a senha pública fornecida pela paciente para visualizar as
        informações de emergência.
      </Text>

      <PinInput value={senha} onChangeText={setSenha} length={TAMANHO_SENHA} />

      <AppButton
        title="Acessar informações"
        onPress={() => {}}
        disabled={senha.length < TAMANHO_SENHA}
        style={styles.botao}
      />

      <Text style={styles.rodape}>
        Acesso registrado por segurança{'\n'}minhasaude.app/s/9f27bd
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginBottom: 24,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  botao: {
    width: '100%',
    marginTop: 28,
    marginBottom: 24,
  },
  rodape: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
