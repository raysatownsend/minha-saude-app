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
import { Lock, QrCode } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import Input from '../components/Input';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';

// caracteres sem O/0 e I/1 — evita confundir quem for digitar o
// código lido em voz alta numa emergência
const CARACTERES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function gerarCodigo(tamanho = 5) {
  let codigo = '';
  for (let i = 0; i < tamanho; i++) {
    codigo += CARACTERES[Math.floor(Math.random() * CARACTERES.length)];
  }
  return codigo;
}

export default function Senhas() {
  const navigation = useNavigation();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [senhaPublica, setSenhaPublica] = useState('4K7T9');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title="Senhas e segurança"
          onBack={() => navigation.goBack()}
        />

        <Text style={styles.secaoTitulo}>SENHA DO APLICATIVO</Text>

        <Input
          label="SENHA ATUAL"
          icon={Lock}
          value={senhaAtual}
          onChangeText={setSenhaAtual}
          secureTextEntry
        />
        <Input
          label="NOVA SENHA"
          placeholder="Mínimo 8 caracteres"
          icon={Lock}
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry
        />
        <Input
          label="CONFIRMAR NOVA SENHA"
          placeholder="Repita a nova senha"
          icon={Lock}
          value={confirmarNovaSenha}
          onChangeText={setConfirmarNovaSenha}
          secureTextEntry
        />

        <AppButton
          title="Atualizar senha"
          onPress={() => {}}
          style={styles.botaoAtualizar}
        />

        <Text style={styles.secaoTitulo}>SENHA PÚBLICA DO QR CODE</Text>

        <View style={styles.publicaCard}>
          <Text style={styles.publicaDescricao}>
            Essa senha é entregue a quem precisar consultar seus dados em uma
            emergência.
          </Text>
          <View style={styles.codigoLinha}>
            {/* .split('').join(' ') só coloca um espaço entre cada
                letra, pra ficar "4 K 7 T 9" em vez de "4K7T9" */}
            <Text style={styles.codigoTexto}>
              {senhaPublica.split('').join(' ')}
            </Text>
            <TouchableOpacity onPress={() => setSenhaPublica(gerarCodigo())}>
              <Text style={styles.gerarNovaTexto}>Gerar nova</Text>
            </TouchableOpacity>
          </View>
        </View>

        <AppButton
          title="Salvar senha pública"
          icon={QrCode}
          variant="success"
          onPress={() => {}}
        />
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
  secaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 12,
  },
  botaoAtualizar: {
    marginTop: 8,
  },
  publicaCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  publicaDescricao: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  codigoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.infoLight,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  codigoTexto: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 2,
  },
  gerarNovaTexto: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
