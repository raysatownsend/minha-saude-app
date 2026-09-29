// src/screens/Clinico.tsx
//
// Virou a versão de LEITURA da aba Clínico — as linhas são
// InfoRow (não editáveis). "Editar" no cabeçalho abre o
// EditarClinico.tsx (o formulário de verdade). Tocar em "Plano de
// saúde" ou "Doenças pré-existentes" abre o detalhe daquele item
// só, em vez da ficha inteira.

import React, { useCallback, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      Promise.all([
        obterMeuPerfil(),
        listarAlergias(),
        listarMedicamentos(),
        listarDoencas(),
        listarCirurgias(),
      ])
        .then(([perfil, alergias, medicamentos, doencas, cirurgias]) => {
          if (!ativo) return;
          setDados({
            perfil,
            alergias: alergias.map((a) => a.alergia),
            medicamentos: medicamentos.map((m) => `${m.medicamento} ${m.dosagem}`),
            doencas: doencas.map((d) => d.doenca),
            cirurgias: cirurgias.map((c) => (c.data ? `${c.cirurgia} (${c.data})` : c.cirurgia)),
          });
        })
        .catch((erro) => console.log('Erro ao carregar dados clínicos:', erro))
        .finally(() => ativo && setCarregando(false));
      return () => {
        ativo = false;
      };
    }, []),
  );

  if (carregando || !dados) {
    return (
      <SafeAreaView style={[styles.container, styles.centro]}>
        <ActivityIndicator color={colors.primary} />
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
});
