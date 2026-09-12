// src/screens/Clinico.tsx
//
// Virou a versão de LEITURA da aba Clínico — as linhas são
// InfoRow (não editáveis). "Editar" no cabeçalho abre o
// EditarClinico.tsx (o formulário de verdade). Tocar em "Plano de
// saúde" ou "Doenças pré-existentes" abre o detalhe daquele item
// só, em vez da ficha inteira.

import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

export default function Clinico() {
  // "any" pelo mesmo motivo de sempre: precisa navegar pra fora do
  // Tab.Navigator (EditarClinico, DetalheClinico).
  const navigation = useNavigation<any>();

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
            subtitle="Unimed · 0123 4567 8901"
          />
        </TouchableOpacity>

        <InfoRow icon={Droplet} title="Tipo sanguíneo" subtitle="O+" />

        <InfoRow
          icon={Ambulance}
          title="Contato de emergência"
          subtitle="Marcos Carraro · (51) 99xxx"
        />

        <InfoRow
          icon={Syringe}
          title="Cirurgias prévias"
          subtitle="Apendicectomia (2016)"
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
            subtitle="Hipertensão, asma"
          />
        </TouchableOpacity>

        <InfoRow
          icon={TriangleAlert}
          title="Alergias a medicamentos"
          subtitle="Dipirona, penicilina"
        />

        <InfoRow
          icon={Pill}
          title="Medicamentos em uso"
          subtitle="Losartana 50mg · 1x dia"
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
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
});
