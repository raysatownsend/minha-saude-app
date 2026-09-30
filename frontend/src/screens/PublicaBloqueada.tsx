import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PinInput from '../components/PinInput';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';
import type { RootStackParamList } from '../navigation/types';
import { verificarSenhaPublica } from '../repositories/publicoRepositorio';

const TAMANHO_SENHA = 5;

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rota = RouteProp<RootStackParamList, 'PublicaBloqueada'>;

export default function PublicaBloqueada() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rota>();
  const codigo = params?.codigo;

  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function acessar() {
    if (!codigo) {
      setErro('Link inválido.');
      return;
    }

    setErro('');
    setCarregando(true);
    try {
      const perfil = await verificarSenhaPublica(codigo, senha);
      navigation.navigate('PublicaLiberada', { perfil });
    } catch {
      // Mesma mensagem pra senha errada, link inexistente e link sem
      // senha pública ainda — o backend já não distingue esses casos
      // (ver PublicoController), e a tela também não deve.
      setErro('Senha incorreta ou link indisponível.');
      setSenha('');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/icon.png')} style={styles.logo} />

      <Text style={styles.titulo}>Dados de saúde protegidos</Text>
      <Text style={styles.subtitulo}>
        Informe a senha pública fornecida pela paciente para visualizar as
        informações de emergência.
      </Text>

      <PinInput value={senha} onChangeText={setSenha} length={TAMANHO_SENHA} />

      {erro.length > 0 && <Text style={styles.erro}>{erro}</Text>}

      <AppButton
        title={carregando ? 'Verificando...' : 'Acessar informações'}
        onPress={acessar}
        disabled={senha.length < TAMANHO_SENHA || carregando}
        style={styles.botao}
      />

      <Text style={styles.rodape}>
        Acesso registrado por segurança{'\n'}
        {codigo ? `minhasaude.app/s/${codigo}` : ''}
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
  erro: {
    color: colors.danger,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
  },
  rodape: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
