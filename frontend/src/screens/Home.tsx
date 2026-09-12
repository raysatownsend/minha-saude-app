// src/screens/Home.tsx
//
// Tela Home (05-home.png). Usa expo-linear-gradient pro cabeçalho
// (é a primeira tela com gradiente de verdade, não cor sólida) —
// instala com: npx expo install expo-linear-gradient

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  Building2,
  Calendar,
  Droplet,
  FileText,
  Pill,
  ShieldCheck,
  Stethoscope,
  TriangleAlert,
} from 'lucide-react-native';
import StatCard from '../components/StatCard';
import InfoRow from '../components/InfoRow';
import { colors } from '../../colors';

export default function Home() {
  // "any" aqui é um atalho consciente: a Home mora dentro do
  // Tab.Navigator, mas precisa navegar tanto pra outra ABA (clinico)
  // quanto pra uma tela do stack de fora (Exames). Tipar isso
  // "direito" exige combinar os dois tipos de navegação
  // (CompositeNavigationProp) — mais TypeScript avançado do que
  // vale a pena agora.
  const navigation = useNavigation<any>();

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
              <Text style={styles.avatarTexto}>RC</Text>
            </View>
            <View style={styles.saudacao}>
              <Text style={styles.ola}>Olá,</Text>
              <Text style={styles.nome}>Raysa Carraro</Text>
            </View>
            <TouchableOpacity>
              <Bell color={colors.textPrimary} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.perfilCard}>
            <View style={styles.perfilInfo}>
              <ShieldCheck color={colors.textPrimary} size={20} />
              <Text style={styles.perfilTexto}>
                Perfil de saúde 85% completo
              </Text>
            </View>
            <Text style={styles.perfilPercentual}>85%</Text>
          </View>
        </LinearGradient>

        <View style={styles.corpo}>
          <View style={styles.grade}>
            <StatCard
              icon={Droplet}
              iconColor={colors.danger}
              iconBg={colors.dangerLight}
              label="Tipo sanguíneo"
              value="O+"
            />
            <StatCard
              icon={Calendar}
              iconColor={colors.primary}
              iconBg={colors.infoLight}
              label="Idade"
              value="38 anos"
            />
          </View>
          <View style={styles.grade}>
            <StatCard
              icon={TriangleAlert}
              iconColor={colors.warning}
              iconBg={colors.warningLight}
              label="Alergias"
              value="2 registradas"
            />
            <StatCard
              icon={Pill}
              iconColor={colors.success}
              iconBg={colors.successLight}
              label="Medicamentos"
              value="3 em uso"
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
              subtitle="Unimed · Plano Pleno"
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
              subtitle="Hipertensão, asma"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Exames')}>
            <InfoRow
              icon={FileText}
              title="Exames anexados"
              subtitle="4 PDFs · atualizado hoje"
            />
          </TouchableOpacity>
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
  perfilPercentual: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
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
