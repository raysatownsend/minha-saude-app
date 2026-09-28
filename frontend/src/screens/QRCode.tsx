import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import QRCode from 'react-native-qrcode-svg';
import { Link2, Lock, Share2, Trash2 } from 'lucide-react-native';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';
import type { RootStackParamList } from '../navigation/types';
import { obterMeuPerfil, removerSenhaPublica } from '../repositories/usuarioRepositorio';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function QrCodeScreen() {
  const navigation = useNavigation<Nav>();
  const [link, setLink] = useState<string | null>(null);
  const [temSenhaPublica, setTemSenhaPublica] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState(false);

  // useFocusEffect, não useEffect: recarrega toda vez que essa aba
  // ganha foco — assim, configurar a senha pública na tela Senhas e
  // voltar pra cá já reflete o estado novo, sem precisar de um
  // gerenciador de estado global só pra isso.
  useFocusEffect(
    useCallback(() => {
      let telaAtiva = true;
      setCarregando(true);
      obterMeuPerfil()
        .then((perfil) => {
          if (!telaAtiva) return;
          setLink(`minhasaude.app/s/${perfil.linkPublicoId}`);
          setTemSenhaPublica(perfil.temSenhaPublica);
        })
        .catch((erro) => console.log('Erro ao carregar perfil:', erro))
        .finally(() => telaAtiva && setCarregando(false));
      return () => {
        telaAtiva = false;
      };
    }, []),
  );

  // Share.share() já vem com o React Native, sem precisar instalar
  // nada. Ela abre o menu de compartilhamento nativo do celular.
  async function compartilhar() {
    if (!link) return;
    try {
      await Share.share({
        message: `Estas são minhas informações de saúde para emergências: https://${link}`,
      });
    } catch (erro) {
      console.log('Erro ao compartilhar:', erro);
    }
  }

  async function excluirLink() {
    setExcluindo(true);
    try {
      await removerSenhaPublica();
      setTemSenhaPublica(false);
    } catch (erro) {
      console.log('Erro ao excluir link:', erro);
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, styles.centro]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!temSenhaPublica || !link) {
    return (
      <SafeAreaView style={[styles.container, styles.centro]}>
        <Lock color={colors.textSecondary} size={32} />
        <Text style={styles.tituloVazio}>Nenhuma senha pública ainda</Text>
        <Text style={styles.instrucao}>
          Configure uma senha pública na tela Senhas para gerar seu QR Code
          de emergência.
        </Text>
        <AppButton
          title="Configurar senha pública"
          onPress={() => navigation.navigate('Senhas')}
          style={styles.botaoVazio}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>QR Code de emergência</Text>

        <View style={styles.card}>
          <QRCode
            value={`https://${link}`}
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
            <Text style={styles.linkTexto}>{link}</Text>
          </View>
        </View>

        <View style={styles.protegidoBanner}>
          <Lock color={colors.textPrimary} size={18} />
          <Text style={styles.protegidoTexto}>Protegido por senha pública</Text>
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
            title={excluindo ? 'Excluindo...' : 'Excluir link'}
            icon={Trash2}
            variant="danger"
            onPress={excluirLink}
            disabled={excluindo}
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
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  tituloVazio: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  botaoVazio: {
    marginTop: 12,
    width: '100%',
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
