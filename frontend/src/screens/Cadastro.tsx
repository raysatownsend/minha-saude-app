import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AxiosError } from 'axios';
import {
  ArrowLeft,
  Check,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from 'lucide-react-native';
import Input from '../components/Input';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';
import type { RootStackParamList } from '../navigation/types';
import { cadastrar } from '../repositories/usuarioRepositorio';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SEXOS = ['Masculino', 'Feminino', 'Outro'] as const;
const TIPOS_SANGUE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

function mensagemDeErro(erro: unknown, padrao: string): string {
  const status = (erro as AxiosError)?.response?.status;
  if (status === 409) return 'Esse email já está cadastrado.';
  if (status === 400) {
    const corpo = (erro as AxiosError)?.response?.data as { message?: string | string[] } | undefined;
    const msg = corpo?.message;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg) && msg.length > 0) return msg[0];
  }
  return padrao;
}

export default function Cadastro() {
  const navigation = useNavigation<Nav>();
  const scrollRef = useRef<ScrollView>(null);
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // etapa 1 — conta
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);

  // etapa 2 — dados pessoais
  const [sexo, setSexo] = useState<(typeof SEXOS)[number] | ''>('');
  const [enderecoCompleto, setEnderecoCompleto] = useState('');

  // etapa 3 — saúde e emergência
  const [planoSaude, setPlanoSaude] = useState('');
  const [tipoSangue, setTipoSangue] = useState<(typeof TIPOS_SANGUE)[number] | ''>('');
  const [contatoNome, setContatoNome] = useState('');
  const [contatoTelefone, setContatoTelefone] = useState('');

  function validarEtapa1(): string {
    if (!nome.trim() || !sobrenome.trim() || !email.trim()) return 'Preencha todos os campos.';
    if (senha.length < 6) return 'A senha deve ter no mínimo 6 caracteres.';
    if (senha !== confirmarSenha) return 'As senhas não coincidem.';
    if (!aceitouTermos) return 'Aceite os termos de uso para continuar.';
    return '';
  }

  function validarEtapa2(): string {
    if (!sexo) return 'Selecione o sexo.';
    if (!enderecoCompleto.trim()) return 'Informe o endereço completo.';
    return '';
  }

  function validarEtapa3(): string {
    if (!tipoSangue) return 'Selecione o tipo sanguíneo.';
    if (!contatoNome.trim() || !contatoTelefone.trim()) {
      return 'Informe nome e telefone do contato de emergência.';
    }
    return '';
  }

  function avancar() {
    const erroEtapa = etapa === 1 ? validarEtapa1() : validarEtapa2();
    if (erroEtapa) {
      setErro(erroEtapa);
      return;
    }
    setErro('');
    setEtapa((atual) => (atual < 3 ? ((atual + 1) as 1 | 2 | 3) : atual));
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }

  function voltar() {
    if (etapa === 1) {
      navigation.goBack();
      return;
    }
    setErro('');
    setEtapa((atual) => (atual - 1) as 1 | 2 | 3);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }

  async function finalizar() {
    const erroEtapa = validarEtapa3();
    if (erroEtapa) {
      setErro(erroEtapa);
      return;
    }

    setErro('');
    setCarregando(true);
    try {
      await cadastrar({
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        username: email.trim(),
        password: senha,
        sexo: sexo as (typeof SEXOS)[number],
        enderecoCompleto: enderecoCompleto.trim(),
        planoSaude: planoSaude.trim() || undefined,
        contatoEmergencia: { nome: contatoNome.trim(), telefone: contatoTelefone.trim() },
        tipoSangue: tipoSangue as (typeof TIPOS_SANGUE)[number],
      });
      // Cenário 1 da story de cadastro: conta criada -> volta pro login,
      // não entra direto (é o que os critérios de aceite já descrevem).
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login', params: { contaCriada: true, username: email.trim() } }],
      });
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível criar a conta. Tente novamente.'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={voltar}>
          <ArrowLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Criar conta</Text>
      </View>

      <View style={styles.progressoLinha}>
        <View style={[styles.progressoBarra, etapa >= 1 && styles.progressoAtiva]} />
        <View style={[styles.progressoBarra, etapa >= 2 && styles.progressoAtiva]} />
        <View style={[styles.progressoBarra, etapa >= 3 && styles.progressoAtiva]} />
      </View>
      <Text style={styles.etapaTexto}>
        {etapa === 1 && 'Etapa 1 de 3 · Dados básicos'}
        {etapa === 2 && 'Etapa 2 de 3 · Dados pessoais'}
        {etapa === 3 && 'Etapa 3 de 3 · Saúde e emergência'}
      </Text>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
      >
        {etapa === 1 && (
          <>
            <Input label="NOME" placeholder="Raysa" icon={User} value={nome} onChangeText={setNome} />
            <Input
              label="SOBRENOME"
              placeholder="Townsend Carraro"
              value={sobrenome}
              onChangeText={setSobrenome}
            />
            <Input
              label="E-MAIL"
              placeholder="raysa@email.com"
              icon={Mail}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              label="SENHA"
              textContentType="oneTimeCode"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Mínimo 6 caracteres"
              icon={Lock}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
            <Input
              label="CONFIRMAR SENHA"
              textContentType="oneTimeCode"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Repita a senha"
              icon={Lock}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.termosBox}
              onPress={() => setAceitouTermos(!aceitouTermos)}
            >
              <View style={[styles.checkbox, aceitouTermos && styles.checkboxMarcado]}>
                {aceitouTermos && <Check color="#fff" size={14} />}
              </View>
              <Text style={styles.termosTexto}>
                Aceito os Termos de Uso e a Política de Privacidade de dados de
                saúde (LGPD).
              </Text>
            </TouchableOpacity>
          </>
        )}

        {etapa === 2 && (
          <>
            <Text style={styles.rotuloSecao}>SEXO</Text>
            <View style={styles.chipsLinha}>
              {SEXOS.map((opcao) => (
                <TouchableOpacity
                  key={opcao}
                  style={[styles.chip, sexo === opcao && styles.chipSelecionado]}
                  onPress={() => setSexo(opcao)}
                >
                  <Text
                    style={[styles.chipTexto, sexo === opcao && styles.chipTextoSelecionado]}
                  >
                    {opcao}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="ENDEREÇO COMPLETO"
              placeholder="Rua, número, bairro, cidade"
              icon={MapPin}
              value={enderecoCompleto}
              onChangeText={setEnderecoCompleto}
            />
          </>
        )}

        {etapa === 3 && (
          <>
            <Input
              label="PLANO DE SAÚDE (OPCIONAL)"
              placeholder="Unimed, SulAmérica..."
              icon={Shield}
              value={planoSaude}
              onChangeText={setPlanoSaude}
            />

            <Text style={styles.rotuloSecao}>TIPO SANGUÍNEO</Text>
            <View style={styles.chipsLinha}>
              {TIPOS_SANGUE.map((opcao) => (
                <TouchableOpacity
                  key={opcao}
                  style={[styles.chipPequeno, tipoSangue === opcao && styles.chipSelecionado]}
                  onPress={() => setTipoSangue(opcao)}
                >
                  <Text
                    style={[
                      styles.chipTexto,
                      tipoSangue === opcao && styles.chipTextoSelecionado,
                    ]}
                  >
                    {opcao}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.rotuloSecao}>CONTATO DE EMERGÊNCIA</Text>
            <Input
              label="NOME DO CONTATO"
              icon={User}
              value={contatoNome}
              onChangeText={setContatoNome}
            />
            <Input
              label="TELEFONE DO CONTATO"
              icon={Phone}
              value={contatoTelefone}
              onChangeText={setContatoTelefone}
              keyboardType="phone-pad"
            />
          </>
        )}

        {erro.length > 0 && <Text style={styles.erro}>{erro}</Text>}

        <AppButton
          title={
            carregando
              ? 'Criando conta...'
              : etapa < 3
              ? 'Continuar'
              : 'Finalizar cadastro'
          }
          onPress={etapa < 3 ? avancar : finalizar}
          disabled={carregando}
          style={styles.botao}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  progressoLinha: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  progressoBarra: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.infoLight,
  },
  progressoAtiva: {
    backgroundColor: colors.primary,
  },
  etapaTexto: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  scroll: {
    paddingBottom: 40,
  },
  rotuloSecao: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
    marginTop: 4,
  },
  chipsLinha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: colors.infoLight,
  },
  chipPequeno: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.infoLight,
  },
  chipSelecionado: {
    backgroundColor: colors.primary,
  },
  chipTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  chipTextoSelecionado: {
    color: '#fff',
  },
  termosBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.successLight,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxMarcado: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  termosTexto: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  erro: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12,
  },
  botao: {
    marginBottom: 24,
  },
});
