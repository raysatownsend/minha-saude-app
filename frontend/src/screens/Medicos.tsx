import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ambulance, Phone, Plus, Stethoscope } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import InfoRow from '../components/InfoRow';
import { colors } from '../../colors';

const medicos = [
  { nome: 'Dra. Helena Prado', detalhe: 'Cardiologia · (51) 99888-10...' },
  { nome: 'Dr. Bruno Lemos', detalhe: 'Clínico geral · (51) 99777-33...' },
  { nome: 'Dra. Ana Vieira', detalhe: 'Pneumologia · (51) 99666-8...' },
];

export default function Medicos() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title="Meus médicos"
          onBack={() => navigation.goBack()}
          RightIcon={Plus}
          onRightPress={() => {}}
        />
        <Text style={styles.subtitulo}>
          Contatos exibidos na página de emergência.
        </Text>

        {medicos.map((medico) => (
          <InfoRow
            key={medico.nome}
            icon={Stethoscope}
            title={medico.nome}
            subtitle={medico.detalhe}
            actionIcon={Phone}
            actionColor={colors.success}
            onAction={() => {}}
          />
        ))}

        <Text style={styles.secaoTitulo}>EMERGÊNCIA</Text>
        <InfoRow
          icon={Ambulance}
          title="Marcos Carraro"
          subtitle="Cônjuge · (51) 99555-1212"
          actionIcon={Phone}
          actionColor={colors.danger}
          onAction={() => {}}
        />

        <TouchableOpacity style={styles.addContato}>
          <Plus color={colors.primary} size={18} />
          <Text style={styles.addContatoTexto}>Adicionar contato</Text>
        </TouchableOpacity>
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
