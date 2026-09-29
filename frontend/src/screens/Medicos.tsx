import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { AxiosError } from 'axios';
import { Ambulance, Phone, Plus, Stethoscope } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import InfoRow from '../components/InfoRow';
import Input from '../components/Input';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';
import { listarMedicos, criarMedico } from '../repositories/medicoRepositorio';
import { obterMeuPerfil } from '../repositories/usuarioRepositorio';
import type { Medico } from '../models/medicoModel';
import type { ContatoEmergencia } from '../models/usuarioModel';

function ligar(telefone: string) {
  const numero = telefone.replace(/[^\d+]/g, '');
  Linking.openURL(`tel:${numero}`).catch((erro) => console.log('Erro ao abrir discador:', erro));
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

export default function Medicos() {
  const navigation = useNavigation();
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [contatoEmergencia, setContatoEmergencia] = useState<ContatoEmergencia | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [formularioAberto, setFormularioAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(() => {
    let ativo = true;
    setCarregando(true);
    Promise.all([listarMedicos(), obterMeuPerfil()])
      .then(([listaMedicos, perfil]) => {
        if (!ativo) return;
        setMedicos(listaMedicos);
        setContatoEmergencia(perfil.contatoEmergencia);
      })
      .catch((erroApi) => console.log('Erro ao carregar médicos:', erroApi))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []);

  useFocusEffect(useCallback(carregar, [carregar]));

  async function adicionarMedico() {
    if (!nome.trim() || !telefone.trim() || !especialidade.trim()) {
      setErro('Preencha nome, telefone e especialidade.');
      return;
    }

    setErro('');
    setSalvando(true);
    try {
      await criarMedico({ nome: nome.trim(), telefone: telefone.trim(), especialidade: especialidade.trim() });
      setNome('');
      setTelefone('');
      setEspecialidade('');
      setFormularioAberto(false);
      carregar();
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível adicionar o médico.'));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ScreenHeader
          title="Meus médicos"
          onBack={() => navigation.goBack()}
          RightIcon={Plus}
          onRightPress={() => setFormularioAberto((atual) => !atual)}
        />
        <Text style={styles.subtitulo}>
          Contatos exibidos na página de emergência.
        </Text>

        {formularioAberto && (
          <View style={styles.formulario}>
            <Input label="NOME DO MÉDICO" value={nome} onChangeText={setNome} />
            <Input label="ESPECIALIDADE" value={especialidade} onChangeText={setEspecialidade} />
            <Input
              label="TELEFONE"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
            />
            {erro.length > 0 && <Text style={styles.erro}>{erro}</Text>}
            <AppButton
              title={salvando ? 'Salvando...' : 'Adicionar médico'}
              onPress={adicionarMedico}
              disabled={salvando}
            />
          </View>
        )}

        {carregando ? (
          <ActivityIndicator color={colors.primary} style={styles.carregando} />
        ) : (
          <>
            {medicos.length === 0 && (
              <Text style={styles.vazio}>Nenhum médico cadastrado ainda.</Text>
            )}
            {medicos.map((medico) => (
              <InfoRow
                key={medico.id}
                icon={Stethoscope}
                title={medico.nome}
                subtitle={`${medico.especialidade} · ${medico.telefone}`}
                actionIcon={Phone}
                actionColor={colors.success}
                onAction={() => ligar(medico.telefone)}
              />
            ))}

            <Text style={styles.secaoTitulo}>EMERGÊNCIA</Text>
            {contatoEmergencia && (
              <InfoRow
                icon={Ambulance}
                title={contatoEmergencia.nome}
                subtitle={contatoEmergencia.telefone}
                actionIcon={Phone}
                actionColor={colors.danger}
                onAction={() => ligar(contatoEmergencia.telefone)}
              />
            )}
          </>
        )}

        {!formularioAberto && (
          <TouchableOpacity style={styles.addContato} onPress={() => setFormularioAberto(true)}>
            <Plus color={colors.primary} size={18} />
            <Text style={styles.addContatoTexto}>Adicionar contato</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  carregando: {
    marginVertical: 20,
  },
  vazio: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  formulario: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  erro: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12,
  },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 12,
  },
  addContato: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    marginTop: 8,
  },
  addContatoTexto: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
});
