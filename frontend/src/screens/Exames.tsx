import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, FileText, Plus, Trash2, type LucideIcon } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import InfoRow from '../components/InfoRow';
import BottomNav from '../components/BottomNav';
import { colors } from '../../colors';

const arquivos: { nome: string; detalhe: string; icon: LucideIcon }[] = [
  { nome: 'Hemograma completo...', detalhe: '12/08/2026 · 1,2 MB', icon: FileText },
  { nome: 'Raio-X tórax.pdf', detalhe: '02/07/2026 · 3,4 MB', icon: FileText },
  { nome: 'Receita cardiologista.p...', detalhe: '21/05/2026 · 480 KB', icon: FileText },
  { nome: 'Carteirinha do plano.jpg', detalhe: '10/03/2026 · 820 KB', icon: Camera },
];

export default function Exames() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title="Exames e documentos"
          onBack={() => navigation.goBack()}
        />

        <TouchableOpacity style={styles.dropzone}>
          <Plus color={colors.primary} size={28} />
          <Text style={styles.dropzoneTexto}>Anexar PDF ou foto</Text>
          <Text style={styles.dropzoneSubtexto}>Até 10 MB por arquivo</Text>
        </TouchableOpacity>

        <Text style={styles.secaoTitulo}>ARQUIVOS RECENTES</Text>

        {arquivos.map((arquivo) => (
          <InfoRow
            key={arquivo.nome}
            icon={arquivo.icon}
            title={arquivo.nome}
            subtitle={arquivo.detalhe}
            actionIcon={Trash2}
            actionColor={colors.textSecondary}
            onAction={() => {}}
          />
        ))}
      </ScrollView>

      <BottomNav active="clinico" />
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
    paddingBottom: 12,
  },
  dropzone: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.infoLight,
  },
  dropzoneTexto: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
    marginTop: 8,
  },
  dropzoneSubtexto: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
});
