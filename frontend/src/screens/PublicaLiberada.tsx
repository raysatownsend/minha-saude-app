import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Ambulance,
  Building2,
  FileText,
  Phone,
  Pill,
  Stethoscope,
  Syringe,
} from 'lucide-react-native';
import InfoRow from '../components/InfoRow';
import { colors } from '../../colors';

export default function PublicaLiberada() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.ficha}>FICHA DE EMERGÊNCIA</Text>
          <Text style={styles.nome}>Raysa Townsend Carraro</Text>
          <Text style={styles.detalhes}>
            38 anos · Feminino · Tipo sanguíneo O+
          </Text>
        </LinearGradient>

        <View style={styles.corpo}>
          <View style={styles.alertaBox}>
            <Text style={styles.alertaTitulo}>ALERGIAS GRAVES</Text>
            <Text style={styles.alertaTexto}>Dipirona · Penicilina</Text>
          </View>

          <InfoRow
            icon={Pill}
            title="Losartana 50mg"
            subtitle="1x ao dia · uso contínuo"
          />
          <InfoRow
            icon={Stethoscope}
            title="Hipertensão e asma"
            subtitle="Doenças pré-existentes"
          />
          <InfoRow
            icon={Syringe}
            title="Apendicectomia (2016)"
            subtitle="Cirurgia prévia"
          />
          <InfoRow
            icon={Building2}
            title="Unimed · Plano Pleno"
            subtitle="0123 4567 8901"
          />
          <InfoRow
            icon={Ambulance}
            title="Marcos Carraro"
            subtitle="Emergência · (51) 99555-1212"
            actionIcon={Phone}
            actionColor={colors.danger}
            onAction={() => {}}
          />
          <InfoRow
            icon={FileText}
            title="Exames em PDF"
            subtitle="4 arquivos disponíveis"
          />
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
    paddingTop: 60,
    paddingBottom: 28,
  },
  ficha: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  nome: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  detalhes: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  corpo: {
    padding: 24,
  },
  alertaBox: {
    backgroundColor: colors.dangerLight,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  alertaTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  alertaTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
  },
});
