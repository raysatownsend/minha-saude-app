// src/screens/EditarClinico.tsx
//
// Era o Clinico.tsx antigo — os campos editáveis + Salvar. Agora o
// Clinico.tsx (aba) virou uma tela só de leitura, e o "Editar" de
// lá (ou de qualquer DetalheClinico) abre este formulário.

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Ambulance,
  Building2,
  Droplet,
  Pill,
  Plus,
  Stethoscope,
  Syringe,
  TriangleAlert,
} from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import Input from '../components/Input';
import { colors } from '../../colors';

export default function EditarClinico() {
  const navigation = useNavigation();
  const [planoSaude, setPlanoSaude] = useState('Unimed · 0123 4567 8901');
  const [tipoSanguineo, setTipoSanguineo] = useState('O+');
  const [contatoEmergencia, setContatoEmergencia] = useState(
    'Marcos Carraro · (51) 99xxx'
  );
  const [cirurgias, setCirurgias] = useState('Apendicectomia (2016)');
  const [doencas, setDoencas] = useState('Hipertensão, asma');
  const [alergias, setAlergias] = useState('Dipirona, penicilina');
  const [medicamentos, setMedicamentos] = useState('Losartana 50mg · 1x dia');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title="Editar informações clínicas"
          onBack={() => navigation.goBack()}
          rightLabel="Salvar"
          onRightPress={() => navigation.goBack()}
        />

        <Input
          label="PLANO DE SAÚDE"
          icon={Building2}
          value={planoSaude}
          onChangeText={setPlanoSaude}
        />
        <Input
          label="TIPO SANGUÍNEO"
          icon={Droplet}
          value={tipoSanguineo}
          onChangeText={setTipoSanguineo}
        />
        <Input
          label="CONTATO DE EMERGÊNCIA"
          icon={Ambulance}
          value={contatoEmergencia}
          onChangeText={setContatoEmergencia}
        />
        <Input
          label="CIRURGIAS PRÉVIAS"
          icon={Syringe}
          value={cirurgias}
          onChangeText={setCirurgias}
        />
        <Input
          label="DOENÇAS PRÉ-EXISTENTES"
          icon={Stethoscope}
          value={doencas}
          onChangeText={setDoencas}
        />
        <Input
          label="ALERGIAS A MEDICAMENTOS"
          icon={TriangleAlert}
          value={alergias}
          onChangeText={setAlergias}
        />
        <Input
          label="MEDICAMENTOS EM USO"
          icon={Pill}
          value={medicamentos}
          onChangeText={setMedicamentos}
        />

        <TouchableOpacity style={styles.addCampo}>
          <Plus color={colors.primary} size={18} />
          <Text style={styles.addCampoTexto}>Adicionar campo personalizado</Text>
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
  addCampo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 999,
    paddingVertical: 16,
    marginTop: 12,
  },
  addCampoTexto: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
});
