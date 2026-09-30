// src/screens/Home.tsx
//
// Tela Home (05-home.png). Usa expo-linear-gradient pro cabeçalho
// (é a primeira tela com gradiente de verdade, não cor sólida) —
// instala com: npx expo install expo-linear-gradient

import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  Building2,
  Droplet,
  Pill,
  QrCode,
  ShieldCheck,
  Stethoscope,
  TriangleAlert,
} from 'lucide-react-native';
import StatCard from '../components/StatCard';
import InfoRow from '../components/InfoRow';
import { colors } from '../../colors';
import { obterMeuPerfil } from '../repositories/usuarioRepositorio';
import { listarAlergias } from '../repositories/alergiaRepositorio';
import { listarMedicamentos } from '../repositories/medicamentoRepositorio';
import { listarDoencas } from '../repositories/doencaRepositorio';
import type { Usuario } from '../models/usuarioModel';

interface ResumoHome {
  perfil: Usuario;
  alergias: number;
  medicamentos: number;
  doencas: string[];
}

function iniciais(nome: string, sobrenome: string): string {
  return `${nome.charAt(0)}${sobrenome.charAt(0)}`.toUpperCase();
}

export default function Home() {
  // "any" aqui é um atalho consciente: a Home mora dentro do
  // Tab.Navigator, mas precisa navegar tanto pra outra ABA (clinico)
  // quanto pra uma tela do stack de fora (Exames). Tipar isso
  // "direito" exige combinar os dois tipos de navegação
  // (CompositeNavigationProp) — mais TypeScript avançado do que
  // vale a pena agora.
  const navigation = useNavigation<any>();
  const [resumo, setResumo] = useState<ResumoHome | null>(null);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      Promise.all([obterMeuPerfil(), listarAlergias(), listarMedicamentos(), listarDoencas()])
        .then(([perfil, alergias, medicamentos, doencas]) => {
          if (!ativo) return;
          setResumo({
            perfil,
            alergias: alergias.length,
            medicamentos: medicamentos.length,
            doencas: doencas.map((d) => d.doenca),
          });
        })
        .catch((erro) => console.log('Erro ao carregar a Home:', erro))
        .finally(() => ativo && setCarregando(false));
      return () => {
        ativo = false;
      };
    }, []),
  );

  if (carregando || !resumo) {
    return (
      <View style={[styles.container, styles.centro]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const { perfil, alergias, medicamentos, doencas } = resumo;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTopo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>{iniciais(perfil.nome, perfil.sobrenome)}</Text>
            </View>
            <View style={styles.saudacao}>
              <Text style={styles.ola}>Olá,</Text>
              <Text style={styles.nome}>
                {perfil.nome} {perfil.sobrenome}
              </Text>
            </View>
            <TouchableOpacity>
              <Bell color={colors.textPrimary} size={24} />
            </TouchableOpacity>
          </View>

          {/* Antes mostrava um "85% completo" fixo — número que eu não
              tinha como calcular de verdade. Isso aqui é real: reflete
              se a senha pública (a base do QR Code de emergência) já
              está configurada ou não. */}
          <TouchableOpacity
            style={styles.perfilCard}
            onPress={() => !perfil.temSenhaPublica && navigation.navigate('Senhas')}
          >
            <View style={styles.perfilInfo}>
              {perfil.temSenhaPublica ? (
                <ShieldCheck color={colors.textPrimary} size={20} />
              ) : (
                <QrCode color={colors.textPrimary} size={20} />
              )}
              <Text style={styles.perfilTexto}>
                {perfil.temSenhaPublica
                  ? 'QR Code de emergência configurado'
                  : 'Configure sua senha pública para gerar o QR Code'}
              </Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.corpo}>
          <View style={styles.grade}>
            <StatCard
              icon={Droplet}
              iconColor={colors.danger}
              iconBg={colors.dangerLight}
              label="Tipo sanguíneo"
              value={perfil.tipoSangue}
            />
            <StatCard
              icon={Building2}
              iconColor={colors.primary}
              iconBg={colors.infoLight}
              label="Plano de saúde"
              value={perfil.planoSaude || 'Não informado'}
            />
          </View>
          <View style={styles.grade}>
            <StatCard
              icon={TriangleAlert}
              iconColor={colors.warning}
              iconBg={colors.warningLight}
              label="Alergias"
              value={alergias === 1 ? '1 registrada' : `${alergias} registradas`}
            />
            <StatCard
              icon={Pill}
              iconColor={colors.success}
              iconBg={colors.successLight}
              label="Medicamentos"
              value={medicamentos === 1 ? '1 em uso' : `${medicamentos} em uso`}
            />
          </View>

          <Text style={styles.secaoTitulo}>RESUMO CLÍNICO</Text>

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
          {/* "Exames anexados" saiu daqui: essa funcionalidade ainda não
              foi construída (não existe endpoint nem tela funcionando
              pra upload de PDF) — mostrar um número aqui seria inventar
              dado de novo, exatamente o problema que essa tela tinha. */}
        </View>
      </ScrollView>
    </View>
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
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: {
    fontWeight: '700',
    color: colors.primary,
  },
  saudacao: {
    flex: 1,
  },
  ola: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  perfilCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 16,
  },
  perfilInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  perfilTexto: {
    fontSize: 15,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  corpo: {
    padding: 24,
  },
  grade: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 12,
  },
});
