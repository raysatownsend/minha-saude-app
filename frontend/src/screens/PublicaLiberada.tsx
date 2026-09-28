import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Ambulance,
  Building2,
  Phone,
  Pill,
  Stethoscope,
  Syringe,
} from 'lucide-react-native';
import InfoRow from '../components/InfoRow';
import { colors } from '../../colors';
import type { RootStackParamList } from '../navigation/types';

type Rota = RouteProp<RootStackParamList, 'PublicaLiberada'>;

export default function PublicaLiberada() {
  const { params } = useRoute<Rota>();
  const perfil = params.perfil;

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
          <Text style={styles.nome}>
            {perfil.nome} {perfil.sobrenome}
          </Text>
          <Text style={styles.detalhes}>
            {perfil.sexo} · Tipo sanguíneo {perfil.tipoSangue}
          </Text>
        </LinearGradient>

        <View style={styles.corpo}>
          <View style={styles.alertaBox}>
            <Text style={styles.alertaTitulo}>ALERGIAS GRAVES</Text>
            <Text style={styles.alertaTexto}>
              {perfil.alergias.length > 0
                ? perfil.alergias.join(' · ')
                : 'Nenhuma alergia conhecida'}
            </Text>
          </View>

          {perfil.medicamentos.map((m, i) => (
            <InfoRow
              key={`medicamento-${i}`}
              icon={Pill}
              title={`${m.medicamento} — ${m.dosagem}`}
              subtitle="Uso contínuo"
            />
          ))}

          {perfil.doencas.length > 0 && (
            <InfoRow
              icon={Stethoscope}
              title={perfil.doencas.join(', ')}
              subtitle="Doenças pré-existentes"
            />
          )}

          {perfil.cirurgias.map((c, i) => (
            <InfoRow
              key={`cirurgia-${i}`}
              icon={Syringe}
              title={c.data ? `${c.cirurgia} (${c.data})` : c.cirurgia}
              subtitle="Cirurgia prévia"
            />
          ))}

          {perfil.planoSaude ? (
            <InfoRow icon={Building2} title={perfil.planoSaude} subtitle="Plano de saúde" />
          ) : null}

          <InfoRow
            icon={Ambulance}
            title={perfil.contatoEmergencia.nome}
            subtitle={`Emergência · ${perfil.contatoEmergencia.telefone}`}
            actionIcon={Phone}
            actionColor={colors.danger}
            onAction={() => {}}
          />

          {perfil.medicos.map((m, i) => (
            <InfoRow
              key={`medico-${i}`}
              icon={Phone}
              title={`${m.nome} · ${m.especialidade}`}
              subtitle={m.telefone}
            />
          ))}
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
