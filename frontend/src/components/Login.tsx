import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AxiosError } from 'axios';
import { Fingerprint, Lock, Mail } from 'lucide-react-native';
import Input from '../components/Input';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';
import type { RootStackParamList } from '../navigation/types';
import { login } from '../repositories/authRepositorio';
import { salvarToken } from '../services/tokenStorage';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function Login() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha.trim()) {
      setErro('Informe email/username e senha.');
      return;
    }

    setErro('');
    setCarregando(true);
    try {
      const { accessToken } = await login({ username: email.trim(), password: senha });
      await salvarToken(accessToken);
      // reset() em vez de navigate(): limpa o histórico de navegação,
      // então apertar "voltar" na Home não retorna pro Login.
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (erroApi) {
      // Mesma mensagem pra "não existe" e "senha errada" — não é o
      // lugar de revelar qual dos dois é o caso (Cenário 2 da story).
      const status = (erroApi as AxiosError)?.response?.status;
      setErro(
        status === 401
          ? 'Usuário ou senha inválidos.'
          : 'Não foi possível entrar. Tente novamente.',
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/icon.png')} style={styles.logo} />

      <Text style={styles.title}>Bem-vinda de volta</Text>
      <Text style={styles.subtitle}>
        Acesse sua conta para ver seus dados clínicos.
      </Text>

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
        icon={Lock}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {erro.length > 0 && <Text style={styles.erro}>{erro}</Text>}

      <TouchableOpacity onPress={() => navigation.navigate('RecuperarSenha')}>
        <Text style={styles.linkEsqueci}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <AppButton
        title={carregando ? 'Entrando...' : 'Entrar'}
        onPress={entrar}
        disabled={carregando}
        style={styles.botaoEntrar}
      />

      <AppButton
        title="Entrar com biometria"
        icon={Fingerprint}
        variant="secondary"
        onPress={entrar}
        disabled={carregando}
      />

      <View style={styles.rodape}>
        <Text style={styles.subtitle}>Não tem conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.linkCadastre}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  linkEsqueci: {
    alignSelf: 'flex-end',
    color: colors.primary,
    fontSize: 14,
    marginBottom: 20,
  },
  erro: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12,
  },
  botaoEntrar: {
    marginBottom: 12,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  linkCadastre: {
    color: colors.primary,
    fontWeight: '600',
  },
});
