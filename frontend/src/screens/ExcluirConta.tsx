import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lock, QrCode, Trash2 } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import Input from '../components/Input';
import InfoRow from '../components/InfoRow';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';

export default function ExcluirConta() {
  const navigation = useNavigation();
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title="Excluir conta"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.iconCircle}>
          <Trash2 color={colors.danger} size={28} />
        </View>

        <Text style={styles.titulo}>Tem certeza que deseja excluir?</Text>
        <Text style={styles.subtitulo}>
          Todos os dados clínicos, exames anexados e o link do QR Code serão
          apagados permanentemente.
        </Text>

        <Text style={styles.secaoTitulo}>
          PREFERE APAGAR SÓ O COMPARTILHAMENTO?
        </Text>

        {/* reaproveitando o InfoRow — mesma cara de linha, só que
            dentro de um TouchableOpacity pra virar tocável */}
        <TouchableOpacity onPress={() => {}}>
          <InfoRow
            icon={QrCode}
            title="Excluir apenas o link do QR Code"
            subtitle="Sua conta continua ativa"
          />
        </TouchableOpacity>

        <Input
          label="CONFIRME SUA SENHA"
          icon={Lock}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <AppButton
          title="Excluir conta definitivamente"
          icon={Trash2}
          variant="danger"
          onPress={() => {}}
          disabled={senha.length === 0}
          style={styles.botaoExcluir}
        />

        <TouchableOpacity
          style={styles.cancelar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelarTexto}>Cancelar</Text>
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
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 24,
  },
  secaoTitulo: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  botaoExcluir: {
    marginTop: 20,
    marginBottom: 16,
  },
  cancelar: {
    alignItems: 'center',
  },
  cancelarTexto: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
