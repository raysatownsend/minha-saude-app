import React from 'react';
import { SafeAreaView, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Link2, Lock, Share2, Trash2 } from 'lucide-react-native';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';

const LINK = 'minhasaude.app/s/9f27bd';

export default function QrCodeScreen() {
  // Share.share() já vem com o React Native, sem precisar instalar
  // nada. Ela abre o menu de compartilhamento nativo do celular — o
  // WhatsApp aparece ali sozinho, junto com Mensagens, E-mail etc.,
  // se estiver instalado. É "async" porque abrir esse menu e esperar
  // a pessoa escolher uma opção leva um tempo indeterminado.
  async function compartilhar() {
    try {
      await Share.share({
        message: `Estas são minhas informações de saúde para emergências: https://${LINK}`,
      });
    } catch (erro) {
      console.log('Erro ao compartilhar:', erro);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>QR Code de emergência</Text>

        <View style={styles.card}>
          <QRCode
            value={`https://${LINK}`}
            size={200}
            color={colors.textPrimary}
            backgroundColor="#fff"
          />
          <Text style={styles.instrucao}>
            Aponte a câmera para acessar a página protegida com seus dados de
            saúde.
          </Text>
          <View style={styles.linkBox}>
            <Link2 color={colors.primary} size={18} />
            <Text style={styles.linkTexto}>{LINK}</Text>
          </View>
        </View>

        <View style={styles.protegidoBanner}>
          <Lock color={colors.textPrimary} size={18} />
          <Text style={styles.protegidoTexto}>
            Protegido por senha pública · última atualização hoje
          </Text>
        </View>

        <View style={styles.botoesLinha}>
          <AppButton
            title="Compartilhar"
            icon={Share2}
            variant="success"
            onPress={compartilhar}
            style={styles.botaoMetade}
          />
          <AppButton
            title="Excluir link"
            icon={Trash2}
            variant="danger"
            onPress={() => {}}
            style={styles.botaoMetade}
          />
        </View>
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
    paddingBottom: 12,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  instrucao: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
    lineHeight: 20,
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.infoLight,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  linkTexto: {
    color: colors.primary,
    fontSize: 14,
  },
  protegidoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.successLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  protegidoTexto: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  botoesLinha: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoMetade: {
    flex: 1,
  },
});
