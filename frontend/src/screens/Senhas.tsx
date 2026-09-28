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
import { alterarSenha, definirSenhaPublica } from '../repositories/usuarioRepositorio';
import { mensagemDeErro } from '../services/erroApi';

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
  const [senhaPublica, setSenhaPublica] = useState(() => gerarCodigo());
  const [senhaLoginConfirmacao, setSenhaLoginConfirmacao] = useState('');
  const [erroSenhaPublica, setErroSenhaPublica] = useState('');
  const [sucessoSenhaPublica, setSucessoSenhaPublica] = useState(false);
  const [salvandoSenhaPublica, setSalvandoSenhaPublica] = useState(false);

  async function salvarSenhaPublica() {
    setSucessoSenhaPublica(false);
    if (!senhaLoginConfirmacao) {
      setErroSenhaPublica('Confirme com sua senha de login para salvar.');
      return;
    }

    setErroSenhaPublica('');
    setSalvandoSenhaPublica(true);
    try {
      await definirSenhaPublica({
        senhaPublica,
        senhaLogin: senhaLoginConfirmacao,
      });
      setSenhaLoginConfirmacao('');
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

        <Input
          label="CONFIRME COM SUA SENHA DE LOGIN"
          icon={Lock}
          value={senhaLoginConfirmacao}
          onChangeText={setSenhaLoginConfirmacao}
          secureTextEntry
        />

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
  publicaCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
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
