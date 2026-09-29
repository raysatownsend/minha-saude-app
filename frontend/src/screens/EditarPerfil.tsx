// src/screens/EditarPerfil.tsx
//
// Formulário de edição do perfil. Antes, esses campos editáveis e
// os links de conta (Médicos, Senhas, Excluir) estavam juntos no
// Perfil.tsx — separei porque são coisas diferentes: editar dado
// vs. navegar pra outra tela. O "Editar" do Perfil abre isto.

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
import type { AxiosError } from 'axios';
import { Camera, MapPin, User } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import Input from '../components/Input';
import { colors } from '../../colors';
import { atualizarPerfil, obterMeuPerfil } from '../repositories/usuarioRepositorio';

const SEXOS = ['Masculino', 'Feminino', 'Outro'] as const;

function iniciais(nome: string, sobrenome: string): string {
  return `${nome.charAt(0)}${sobrenome.charAt(0)}`.toUpperCase();
}

function mensagemDeErro(erro: unknown, padrao: string): string {
  const status = (erro as AxiosError)?.response?.status;
  const corpo = (erro as AxiosError)?.response?.data as { message?: string | string[] } | undefined;
  if (status === 400) {
    const msg = corpo?.message;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg) && msg.length > 0) return msg[0];
  }
  return padrao;
}

export default function EditarPerfil() {
  const navigation = useNavigation();
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [sexo, setSexo] = useState<(typeof SEXOS)[number] | ''>('');
  const [endereco, setEndereco] = useState('');

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      obterMeuPerfil()
        .then((perfil) => {
          if (!ativo) return;
          setNome(perfil.nome);
          setSobrenome(perfil.sobrenome);
          setSexo(perfil.sexo);
          setEndereco(perfil.enderecoCompleto);
        })
        .catch((erroApi) => console.log('Erro ao carregar perfil:', erroApi))
        .finally(() => ativo && setCarregando(false));
      return () => {
        ativo = false;
      };
    }, []),
  );

  async function salvar() {
    if (!nome.trim() || !sobrenome.trim() || !sexo || !endereco.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    setErro('');
    setSalvando(true);
    try {
      await atualizarPerfil({
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        sexo,
        enderecoCompleto: endereco.trim(),
      });
      navigation.goBack();
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível salvar as alterações.'));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, styles.centro]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ScreenHeader
          title="Editar perfil"
          onBack={() => navigation.goBack()}
          rightLabel={salvando ? 'Salvando...' : 'Salvar'}
          onRightPress={salvando ? undefined : salvar}
        />

        <View style={styles.avatarArea}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{iniciais(nome || '?', sobrenome || '?')}</Text>
          </View>
          <TouchableOpacity style={styles.cameraBotao}>
            <Camera color="#fff" size={16} />
          </TouchableOpacity>
        </View>

        <Input label="NOME" icon={User} value={nome} onChangeText={setNome} />
        <Input label="SOBRENOME" value={sobrenome} onChangeText={setSobrenome} />

        <Text style={styles.rotulo}>SEXO</Text>
        <View style={styles.chipsLinha}>
          {SEXOS.map((opcao) => (
            <TouchableOpacity
              key={opcao}
              style={[styles.chip, sexo === opcao && styles.chipSelecionado]}
              onPress={() => setSexo(opcao)}
            >
              <Text style={[styles.chipTexto, sexo === opcao && styles.chipTextoSelecionado]}>
                {opcao}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="ENDEREÇO COMPLETO"
          icon={MapPin}
          value={endereco}
          onChangeText={setEndereco}
        />

        {erro.length > 0 && <Text style={styles.erro}>{erro}</Text>}
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
    paddingBottom: 40,
  },
  avatarArea: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cameraBotao: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  rotulo: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
    marginTop: 4,
  },
  chipsLinha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: colors.infoLight,
  },
  chipSelecionado: {
    backgroundColor: colors.primary,
  },
  chipTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  chipTextoSelecionado: {
    color: '#fff',
  },
  erro: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 8,
  },
});
