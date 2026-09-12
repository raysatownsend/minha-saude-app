// src/screens/DetalheClinico.tsx
//
// Tela genérica: mostra UM item clínico por vez, não a ficha
// inteira. Qual item vem por parâmetro de navegação
// (route.params.item) — quem decide isso é quem chamou
// navigation.navigate('DetalheClinico', { item: '...' }), não esse
// arquivo.
//
// Sem backend ainda, os valores abaixo são fixos "na mão" e
// precisam bater com o que está no EditarClinico.tsx. No dia em que
// existir uma fonte de dados de verdade, os dois passam a ler do
// mesmo lugar em vez de repetir o texto.

import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Building2, Stethoscope } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';
import type { RootStackParamList } from '../navigation/types';

const ITENS = {
  planoSaude: {
    titulo: 'Plano de saúde',
    valor: 'Unimed · 0123 4567 8901',
    icon: Building2,
  },
  doencasPreExistentes: {
    titulo: 'Doenças pré-existentes',
    valor: 'Hipertensão, asma',
    icon: Stethoscope,
  },
} as const;

type Rota = RouteProp<RootStackParamList, 'DetalheClinico'>;

export default function DetalheClinico() {
  const navigation = useNavigation<any>();
  const { params } = useRoute<Rota>();
  const item = ITENS[params.item];
  const Icon = item.icon;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={item.titulo} onBack={() => navigation.goBack()} />

      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Icon color={colors.primary} size={24} />
        </View>
        <Text style={styles.valor}>{item.valor}</Text>
      </View>

      <AppButton
        title="Editar"
        variant="secondary"
        onPress={() => navigation.navigate('EditarClinico')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  valor: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
