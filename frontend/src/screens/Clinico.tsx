// src/screens/Clinico.tsx
//
// Virou a versão de LEITURA da aba Clínico — as linhas são
// InfoRow (não editáveis). "Editar" no cabeçalho abre o
// EditarClinico.tsx (o formulário de verdade). Tocar em "Plano de
// saúde" ou "Doenças pré-existentes" abre o detalhe daquele item
// só, em vez da ficha inteira.

import React, { useCallback, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Ambulance,
  Building2,
  Droplet,
  Pill,
  Stethoscope,
  Syringe,
  TriangleAlert,
} from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import InfoRow from '../components/InfoRow';
import { colors } from '../../colors';
import { obterMeuPerfil } from '../repositories/usuarioRepositorio';
import { listarAlergias } from '../repositories/alergiaRepositorio';
import { listarMedicamentos } from '../repositories/medicamentoRepositorio';
import { listarDoencas } from '../repositories/doencaRepositorio';
import { listarCirurgias } from '../repositories/cirurgiaRepositorio';
import type { Usuario } from '../models/usuarioModel';
import { mensagemDeErro } from '../services/erroApi';

interface DadosClinicos {
  perfil: Usuario;
  alergias: string[];
  medicamentos: string[];
  doencas: string[];
  cirurgias: string[];
}

export default function Clinico() {
  // "any" pelo mesmo motivo de sempre: precisa navegar pra fora do
  // Tab.Navigator (EditarClinico, DetalheClinico).
  const navigation = useNavigation<any>();
  const [dados, setDados] = useState<DadosClinicos | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      setErro('');
      // Diagnóstico: aparece no terminal do Expo toda vez que a aba ganha
      // foco. Pode apagar quando o problema estiver resolvido.
      if (__DEV__) console.log('[Clinico] aba em foco, buscando dados...');
      Promise.all([
        obterMeuPerfil(),
        listarAlergias(),
        listarMedicamentos(),
        listarDoencas(),
        listarCirurgias(),
      ])
        .then(([perfil, alergias, medicamentos, doencas, cirurgias]) => {
          if (!ativo) return;
          if (__DEV__) console.log('[Clinico] recebido:', perfil.tipoSangue, alergias.length, 'alergia(s)');
          setDados({
            perfil,
            alergias: alergias.map((a) => a.alergia),
            medicamentos: medicamentos.map((m) => `${m.medicamento} ${m.dosagem}`),
            doencas: doencas.map((d) => d.doenca),
            cirurgias: cirurgias.map((c) => (c.data ? `${c.cirurgia} (${c.data})` : c.cirurgia)),
          });
        })
        // Antes o erro só ia pro console e a tela continuava mostrando os
        // dados ANTIGOS, sem avisar nada. Agora a mensagem aparece na tela.
        .catch((erroApi) => {
          if (ativo) setErro(mensagemDeErro(erroApi, 'Não foi possível carregar as informações clínicas.'));
        })
        .finally(() => ativo && setCarregando(false));
      return () => {
        ativo = false;
      };
    }, []),
  );

  // Sem dados E sem erro = ainda carregando. Antes, se a primeira busca
  // falhasse, "dados" ficava null pra sempre e o spinner nunca sumia.
  if (!dados) {
    return (
      <SafeAreaView style={[styles.container, styles.centro]}>
        {erro ? <Text style={styles.erro}>{erro}</Text> : <ActivityIndicator color={colors.primary} />}
      </SafeAreaView>
    );
  }

  const { perfil, alergias, medicamentos, doencas, cirurgias } = dados;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title="Informações clínicas"
          rightLabel="Editar"
          onRightPress={() => navigation.navigate('EditarClinico')}
        />

        {carregando && <ActivityIndicator color={colors.primary} style={styles.atualizando} />}
        {erro.length > 0 && <Text style={styles.erro}>{erro}</Text>}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DetalheClinico', { item: 'planoSaude' })
          }
        >
          <InfoRow
            icon={Building2}
            title="Plano de saúde"
            subtitle={perfil.planoSaude || 'Não informado'}
          />
        </TouchableOpacity>

        <InfoRow icon={Droplet} title="Tipo sanguíneo" subtitle={perfil.tipoSangue} />

        <InfoRow
          icon={Ambulance}
          title="Contato de emergência"
          subtitle={`${perfil.contatoEmergencia.nome} · ${perfil.contatoEmergencia.telefone}`}
        />

        <InfoRow
          icon={Syringe}
          title="Cirurgias prévias"
          subtitle={cirurgias.length > 0 ? cirurgias.join(', ') : 'Nenhuma registrada'}
        />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DetalheClinico', {
              item: 'doencasPreExistentes',
            })
          }
        >
          <InfoRow
            icon={Stethoscope}
            title="Doenças pré-existentes"
            subtitle={doencas.length > 0 ? doencas.join(', ') : 'Nenhuma registrada'}
          />
        </TouchableOpacity>

        <InfoRow
          icon={TriangleAlert}
          title="Alergias a medicamentos"
          subtitle={alergias.length > 0 ? alergias.join(', ') : 'Nenhuma conhecida'}
        />

        <InfoRow
          icon={Pill}
          title="Medicamentos em uso"
          subtitle={medicamentos.length > 0 ? medicamentos.join(', ') : 'Nenhum registrado'}
        />
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
  atualizando: {
    marginBottom: 12,
  },
  erro: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});