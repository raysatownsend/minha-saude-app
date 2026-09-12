import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Check, Lock, Mail, User } from 'lucide-react-native';
import Input from '../components/Input';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';

export default function Cadastro() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Criar conta</Text>
      </View>

      {/* barra de progresso: 3 etapas, só a 1ª preenchida por enquanto */}
      <View style={styles.progressoLinha}>
        <View style={[styles.progressoBarra, styles.progressoAtiva]} />
        <View style={styles.progressoBarra} />
        <View style={styles.progressoBarra} />
      </View>
      <Text style={styles.etapaTexto}>Etapa 1 de 3 · Dados básicos</Text>

      <Input
        label="NOME"
        placeholder="Raysa"
        icon={User}
        value={nome}
        onChangeText={setNome}
      />

      {/* SOBRENOME não tem ícone no seu design — por isso o Input
          precisou virar opcional no icon (veja a explicação na
          mensagem) */}
      <Input
        label="SOBRENOME"
        placeholder="Townsend Carraro"
        value={sobrenome}
        onChangeText={setSobrenome}
      />

      <Input
        label="E-MAIL"
        placeholder="raysa@email.com"
        icon={Mail}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        label="SENHA"
        placeholder="Mínimo 8 caracteres"
        icon={Lock}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Input
        label="CONFIRMAR SENHA"
        placeholder="Repita a senha"
        icon={Lock}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.termosBox}
        onPress={() => setAceitouTermos(!aceitouTermos)}
      >
        <View
          style={[styles.checkbox, aceitouTermos && styles.checkboxMarcado]}
        >
          {aceitouTermos && <Check color="#fff" size={14} />}
        </View>
        <Text style={styles.termosTexto}>
          Aceito os Termos de Uso e a Política de Privacidade de dados de
          saúde (LGPD).
        </Text>
      </TouchableOpacity>

      {/* disabled vem "de graça" do TouchableOpacityProps que o
          AppButton já herda — enquanto aceitouTermos for false, o
          botão fica opaco e não dispara onPress */}
      <AppButton
        title="Continuar"
        onPress={() => {}}
        disabled={!aceitouTermos}
        style={styles.botao}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  progressoLinha: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  progressoBarra: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.infoLight,
  },
  progressoAtiva: {
    backgroundColor: colors.primary,
  },
  etapaTexto: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  termosBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.successLight,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxMarcado: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  termosTexto: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  botao: {
    marginBottom: 24,
  },
});
