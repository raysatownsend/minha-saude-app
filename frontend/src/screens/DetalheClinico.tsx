// src/screens/DetalheClinico.tsx
//
// Tela genérica: mostra UM item clínico por vez, não a ficha
// inteira. Qual item vem por parâmetro de navegação
// (route.params.item) — quem decide isso é quem chamou
// navigation.navigate('DetalheClinico', { item: '...' }), não esse
// arquivo. Os dois itens buscam de fontes diferentes (perfil x lista
// de doenças), por isso o "valor" de cada um é resolvido separado,
// não um mapa de texto fixo como antes.

import React, { useCallback, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Building2, Stethoscope } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';
import type { RootStackParamList } from '../navigation/types';
import { obterMeuPerfil } from '../repositories/usuarioRepositorio';
import { listarDoencas } from '../repositories/doencaRepositorio';

const CONFIG = {
  planoSaude: { titulo: 'Plano de saúde', icon: Building2 },
  doencasPreExistentes: { titulo: 'Doenças pré-existentes', icon: Stethoscope },
} as const;

type Rota = RouteProp<RootStackParamList, 'DetalheClinico'>;

export default function DetalheClinico() {
  const navigation = useNavigation<any>();
  const { params } = useRoute<Rota>();
  const config = CONFIG[params.item];
  const Icon = config.icon;

  const [valor, setValor] = useState('');
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);

      const busca =
        params.item === 'planoSaude'
          ? obterMeuPerfil().then((perfil) => perfil.planoSaude || 'Não informado')
          : listarDoencas().then((doencas) =>
              doencas.length > 0 ? doencas.map((d) => d.doenca).join(', ') : 'Nenhuma registrada',
            );

      busca
        .then((texto) => ativo && setValor(texto))
        .catch((erro) => console.log('Erro ao carregar detalhe clínico:', erro))
        .finally(() => ativo && setCarregando(false));

      return () => {
        ativo = false;
      };
    }, [params.item]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={config.titulo} onBack={() => navigation.goBack()} />

      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Icon color={colors.primary} size={24} />
        </View>
        {carregando ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.valor}>{valor}</Text>
        )}
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
    minHeight: 120,
    justifyContent: 'center',
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
