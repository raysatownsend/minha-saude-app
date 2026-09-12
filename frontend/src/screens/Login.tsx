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
import { Fingerprint, Lock, Mail } from 'lucide-react-native';
import Input from '../components/Input';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function Login() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // reset() em vez de navigate(): limpa o histórico de navegação,
  // então apertar "voltar" na Home não retorna pro Login. navigate()
  // simplesmente empilharia MainTabs por cima do Login.
  function entrar() {
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
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

      <TouchableOpacity onPress={() => navigation.navigate('RecuperarSenha')}>
        <Text style={styles.linkEsqueci}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <AppButton title="Entrar" onPress={entrar} style={styles.botaoEntrar} />

      <AppButton
        title="Entrar com biometria"
        icon={Fingerprint}
        variant="secondary"
        onPress={entrar}
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
