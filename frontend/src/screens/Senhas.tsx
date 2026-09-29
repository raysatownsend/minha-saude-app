import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { AxiosError } from 'axios';
import { Lock, QrCode } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import Input from '../components/Input';
import PinInput from '../components/PinInput';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';
import {
  alterarSenha,
  definirSenhaPublica,
  obterMeuPerfil,
} from '../repositories/usuarioRepositorio';

const TAMANHO_SENHA_PUBLICA = 5;
// caracteres sem O/0 e I/1 — evita confundir quem for digitar o
// código lido em voz alta numa emergência
const CARACTERES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function gerarCodigo(tamanho = TAMANHO_SENHA_PUBLICA) {
  let codigo = '';
  for (let i = 0; i < tamanho; i++) {
    codigo += CARACTERES[Math.floor(Math.random() * CARACTERES.length)];
  }
  return codigo;
}

function mensagemDeErro(erro: unknown, padrao: string): string {
  const status = (erro as AxiosError)?.response?.status;
  const corpo = (erro as AxiosError)?.response?.data as { message?: string | string[] } | undefined;
  if (status === 400 || status === 401) {
    const msg = corpo?.message;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg) && msg.length > 0) return msg[0];
  }
  return padrao;
}

export default function Senhas() {
  const navigation = useNavigation();
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);

  // --- senha do aplicativo ---
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [erroSenhaApp, setErroSenhaApp] = useState('');
  const [sucessoSenhaApp, setSucessoSenhaApp] = useState(false);
  const [salvandoSenhaApp, setSalvandoSenhaApp] = useState(false);

  async function atualizarSenha() {
    setSucessoSenhaApp(false);
    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
      setErroSenhaApp('Preencha os três campos.');
      return;
    }
    if (novaSenha !== confirmarNovaSenha) {
      setErroSenhaApp('A nova senha e a confirmação não coincidem.');
      return;
    }
    if (novaSenha.length < 6) {
      setErroSenhaApp('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setErroSenhaApp('');
    setSalvandoSenhaApp(true);
    try {
      await alterarSenha({ senhaAtual, novaSenha });
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarNovaSenha('');
      setSucessoSenhaApp(true);
    } catch (erro) {
      setErroSenhaApp(mensagemDeErro(erro, 'Não foi possível atualizar a senha.'));
    } finally {
      setSalvandoSenhaApp(false);
    }
  }

  // --- senha pública do QR Code ---
  // Vazia por padrão — antes vinha com um código já sorteado, o que
  // não deixava claro que dava pra escolher o próprio valor.
  const [senhaPublica, setSenhaPublica] = useState('');
  const [temSenhaPublica, setTemSenhaPublica] = useState(false);
  const [senhaLoginConfirmacao, setSenhaLoginConfirmacao] = useState('');
  const [erroSenhaPublica, setErroSenhaPublica] = useState('');
  const [sucessoSenhaPublica, setSucessoSenhaPublica] = useState(false);
  const [salvandoSenhaPublica, setSalvandoSenhaPublica] = useState(false);

  // useFocusEffect: se ela sair pra trocar a senha de login e voltar,
  // ou definir a senha pública pela 1ª vez e reabrir esta tela depois,
  // o "já tem senha pública?" reflete o estado atual de verdade.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregandoPerfil(true);
      obterMeuPerfil()
        .then((perfil) => ativo && setTemSenhaPublica(perfil.temSenhaPublica))
        .catch((erro) => console.log('Erro ao carregar perfil:', erro))
        .finally(() => ativo && setCarregandoPerfil(false));
      return () => {
        ativo = false;
      };
    }, []),
  );

  async function salvarSenhaPublica() {
    setSucessoSenhaPublica(false);
    if (senhaPublica.length < TAMANHO_SENHA_PUBLICA) {
      setErroSenhaPublica('Digite ou gere um código de 5 caracteres.');
      return;
    }
    // Só exige a senha de login se já existir uma senha pública ativa
    // — no primeiro cadastro, já ter feito login já basta (ver o
    // mesmo raciocínio no backend, em UsuariosRepository).
    if (temSenhaPublica && !senhaLoginConfirmacao) {
      setErroSenhaPublica('Confirme com sua senha de login para alterar a senha pública.');
      return;
    }

    setErroSenhaPublica('');
    setSalvandoSenhaPublica(true);
    try {
      await definirSenhaPublica({
        senhaPublica,
        senhaLogin: temSenhaPublica ? senhaLoginConfirmacao : undefined,
      });
      setSenhaLoginConfirmacao('');
      setTemSenhaPublica(true);
      setSucessoSenhaPublica(true);
    } catch (erro) {
      setErroSenhaPublica(mensagemDeErro(erro, 'Não foi possível salvar a senha pública.'));
    } finally {
      setSalvandoSenhaPublica(false);
    }
  }

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
          placeholder="Mínimo 6 caracteres"
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

        {erroSenhaApp.length > 0 && <Text style={styles.erro}>{erroSenhaApp}</Text>}
        {sucessoSenhaApp && <Text style={styles.sucesso}>Senha atualizada.</Text>}

        <AppButton
          title={salvandoSenhaApp ? 'Salvando...' : 'Atualizar senha'}
          onPress={atualizarSenha}
          disabled={salvandoSenhaApp}
          style={styles.botaoAtualizar}
        />

        <Text style={styles.secaoTitulo}>SENHA PÚBLICA DO QR CODE</Text>

        {carregandoPerfil ? (
          <ActivityIndicator color={colors.primary} style={styles.carregandoPerfil} />
        ) : (
          <>
            <View style={styles.publicaCard}>
              <Text style={styles.publicaDescricao}>
                {temSenhaPublica
                  ? 'Essa senha é entregue a quem precisar consultar seus dados em uma emergência.'
                  : 'Escolha os 5 caracteres que vão liberar sua página de emergência, ou gere um código automático.'}
              </Text>

              <PinInput
                value={senhaPublica}
                onChangeText={setSenhaPublica}
                length={TAMANHO_SENHA_PUBLICA}
              />

              <TouchableOpacity
                style={styles.gerarNovaBotao}
                onPress={() => setSenhaPublica(gerarCodigo())}
              >
                <Text style={styles.gerarNovaTexto}>Gerar código automático</Text>
              </TouchableOpacity>
            </View>

            {temSenhaPublica && (
              <Input
                label="CONFIRME COM SUA SENHA DE LOGIN"
                icon={Lock}
                value={senhaLoginConfirmacao}
                onChangeText={setSenhaLoginConfirmacao}
                secureTextEntry
              />
            )}

            {erroSenhaPublica.length > 0 && <Text style={styles.erro}>{erroSenhaPublica}</Text>}
            {sucessoSenhaPublica && (
              <Text style={styles.sucesso}>
                Senha pública salva — o QR Code já está pronto pra uso.
              </Text>
            )}

            <AppButton
              title={salvandoSenhaPublica ? 'Salvando...' : 'Salvar senha pública'}
              icon={QrCode}
              variant="success"
              onPress={salvarSenhaPublica}
              disabled={salvandoSenhaPublica}
            />
          </>
        )}
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
  erro: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12,
  },
  sucesso: {
    color: colors.success,
    fontSize: 13,
    marginBottom: 12,
  },
  carregandoPerfil: {
    marginVertical: 20,
  },
  publicaCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  publicaDescricao: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
  gerarNovaBotao: {
    marginTop: 16,
  },
  gerarNovaTexto: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
