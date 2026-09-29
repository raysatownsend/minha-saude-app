// src/screens/Perfil.tsx
//
// Virou a versão de LEITURA — nome, e-mail e dados como texto, não
// como Input editável. "Editar" abre o EditarPerfil.tsx. A seção
// CONTA continua aqui (são links de navegação, não campos de dado).

import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LogOut, Lock, MapPin, Stethoscope, Trash2, User } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import InfoRow from '../components/InfoRow';
import { colors } from '../../colors';
import { obterMeuPerfil } from '../repositories/usuarioRepositorio';
import { removerToken } from '../services/tokenStorage';
import type { Usuario } from '../models/usuarioModel';

function iniciais(nome: string, sobrenome: string): string {
  return `${nome.charAt(0)}${sobrenome.charAt(0)}`.toUpperCase();
}

export default function Perfil() {
  // "any" pelo mesmo motivo de sempre: precisa navegar pra fora do
  // Tab.Navigator (EditarPerfil, Medicos, Senhas, ExcluirConta, Login).
  const navigation = useNavigation<any>();
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  // useFocusEffect, não useEffect: assim, voltar de "Editar perfil" já
  // recarrega os dados novos, sem precisar de um gerenciador de estado
  // global só pra isso — mesmo padrão já usado na tela do QR Code.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      obterMeuPerfil()
        .then((dados) => ativo && setPerfil(dados))
        .catch((erro) => console.log('Erro ao carregar perfil:', erro))
        .finally(() => ativo && setCarregando(false));
      return () => {
        ativo = false;
      };
    }, []),
  );

  async function sair() {
    await removerToken();
    // reset(), não navigate(): sem isso, "voltar" no Login retornaria
    // pro app mesmo sem token nenhum salvo.
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  if (carregando || !perfil) {
    return (
      <SafeAreaView style={[styles.container, styles.centro]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title="Meu perfil"
          rightLabel="Editar"
          onRightPress={() => navigation.navigate('EditarPerfil')}
        />

        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{iniciais(perfil.nome, perfil.sobrenome)}</Text>
        </View>
        <Text style={styles.nomeCompleto}>
          {perfil.nome} {perfil.sobrenome}
        </Text>
        <Text style={styles.email}>{perfil.username}</Text>

        <InfoRow icon={User} title="Sexo" subtitle={perfil.sexo} />
        <InfoRow icon={MapPin} title="Endereço" subtitle={perfil.enderecoCompleto} />

        <Text style={styles.secaoTitulo}>CONTA</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Medicos')}>
          <InfoRow
            icon={Stethoscope}
            title="Meus médicos"
            subtitle="Contatos de emergência"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Senhas')}>
          <InfoRow
            icon={Lock}
            title="Senhas e segurança"
            subtitle="Senha do app e senha pública do QR Code"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ExcluirConta')}>
          <InfoRow
            icon={Trash2}
            title="Excluir conta"
            subtitle="Apagar dados permanentemente"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={sair}>
          <InfoRow icon={LogOut} title="Sair" subtitle="Encerrar sessão neste aparelho" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    padding: 24,
    paddingBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  avatarTexto: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  nomeCompleto: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 12,
  },
});
