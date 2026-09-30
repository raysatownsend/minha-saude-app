// src/screens/EditarClinico.tsx
//
// Era o Clinico.tsx antigo — os campos editáveis + Salvar. Agora o
// Clinico.tsx (aba) virou uma tela só de leitura, e o "Editar" de
// lá (ou de qualquer DetalheClinico) abre este formulário.
//
// Plano de saúde, tipo sanguíneo e contato de emergência moram no
// perfil (um valor só) — por isso têm um "Salvar" próprio. Já
// cirurgias, doenças, alergias e medicamentos são LISTAS de verdade
// no backend (cada uma com seu próprio id) — por isso cada item tem
// botão de remover, e adicionar já salva na hora, sem precisar de
// um "Salvar" geral pra eles.

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
import {
  Ambulance,
  Building2,
  Droplet,
  Pill,
  Stethoscope,
  Syringe,
  TriangleAlert,
  X,
} from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import Input from '../components/Input';
import AppButton from '../components/AppButton';
import { colors } from '../../colors';
import { atualizarPerfil, obterMeuPerfil } from '../repositories/usuarioRepositorio';
import { listarAlergias, criarAlergia, excluirAlergia } from '../repositories/alergiaRepositorio';
import {
  listarMedicamentos,
  criarMedicamento,
  excluirMedicamento,
} from '../repositories/medicamentoRepositorio';
import { listarDoencas, criarDoenca, excluirDoenca } from '../repositories/doencaRepositorio';
import { listarCirurgias, criarCirurgia, excluirCirurgia } from '../repositories/cirurgiaRepositorio';
import type { Alergia } from '../models/alergiaModel';
import type { Medicamento } from '../models/medicamentoModel';
import type { Doenca } from '../models/doencaModel';
import type { Cirurgia } from '../models/cirurgiaModel';

const TIPOS_SANGUE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

function mensagemDeErro(erro: unknown, padrao: string): string {
  const status = (erro as AxiosError)?.response?.status;
  const corpo = (erro as AxiosError)?.response?.data as { message?: string | string[] } | undefined;
  if (status === 400) {
    const msg = corpo?.message;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg) && msg.length > 0) return msg[0];
  }
  return padrao;
}

// Bloco repetido pelas 4 listas: os itens já salvos (com botão de
// remover) e, embaixo, o que a própria tela manda como formulário de
// adicionar — que muda de uma lista pra outra (medicamento tem 2
// campos, as outras têm 1).
function SecaoLista({
  titulo,
  icon: Icon,
  itens,
  onRemover,
  children,
}: {
  titulo: string;
  icon: React.ComponentType<{ color: string; size: number }>;
  itens: { id: number; texto: string }[];
  onRemover: (id: number) => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.secao}>
      <View style={styles.secaoCabecalho}>
        <Icon color={colors.primary} size={18} />
        <Text style={styles.secaoTitulo}>{titulo}</Text>
      </View>

      {itens.length === 0 && <Text style={styles.listaVazia}>Nada cadastrado ainda.</Text>}
      {itens.map((item) => (
        <View key={item.id} style={styles.itemLinha}>
          <Text style={styles.itemTexto}>{item.texto}</Text>
          <TouchableOpacity
            onPress={() => onRemover(item.id)}
            accessibilityLabel={`Remover ${item.texto}`}
          >
            <X color={colors.danger} size={18} />
          </TouchableOpacity>
        </View>
      ))}

      {children}
    </View>
  );
}

export default function EditarClinico() {
  const navigation = useNavigation();
  const [carregando, setCarregando] = useState(true);

  // --- plano de saúde / tipo sanguíneo / contato de emergência ---
  const [planoSaude, setPlanoSaude] = useState('');
  const [tipoSangue, setTipoSangue] = useState<(typeof TIPOS_SANGUE)[number] | ''>('');
  const [contatoNome, setContatoNome] = useState('');
  const [contatoTelefone, setContatoTelefone] = useState('');
  const [erroGeral, setErroGeral] = useState('');
  const [sucessoGeral, setSucessoGeral] = useState(false);
  const [salvandoGeral, setSalvandoGeral] = useState(false);

  // --- as 4 listas clínicas ---
  const [alergias, setAlergias] = useState<Alergia[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [doencas, setDoencas] = useState<Doenca[]>([]);
  const [cirurgias, setCirurgias] = useState<Cirurgia[]>([]);

  const [novaAlergia, setNovaAlergia] = useState('');
  const [novoMedicamento, setNovoMedicamento] = useState('');
  const [novaDosagem, setNovaDosagem] = useState('');
  const [novaDoenca, setNovaDoenca] = useState('');
  const [novaCirurgia, setNovaCirurgia] = useState('');
  const [novaCirurgiaAno, setNovaCirurgiaAno] = useState('');

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      Promise.all([
        obterMeuPerfil(),
        listarAlergias(),
        listarMedicamentos(),
        listarDoencas(),
        listarCirurgias(),
      ])
        .then(([perfil, listaAlergias, listaMedicamentos, listaDoencas, listaCirurgias]) => {
          if (!ativo) return;
          setPlanoSaude(perfil.planoSaude || '');
          setTipoSangue(perfil.tipoSangue);
          setContatoNome(perfil.contatoEmergencia.nome);
          setContatoTelefone(perfil.contatoEmergencia.telefone);
          setAlergias(listaAlergias);
          setMedicamentos(listaMedicamentos);
          setDoencas(listaDoencas);
          setCirurgias(listaCirurgias);
        })
        .catch((erro) => console.log('Erro ao carregar informações clínicas:', erro))
        .finally(() => ativo && setCarregando(false));
      return () => {
        ativo = false;
      };
    }, []),
  );

  async function salvarGeral() {
    if (!tipoSangue || !contatoNome.trim() || !contatoTelefone.trim()) {
      setErroGeral('Preencha tipo sanguíneo e o contato de emergência.');
      return;
    }
    setErroGeral('');
    setSucessoGeral(false);
    setSalvandoGeral(true);
    try {
      await atualizarPerfil({
        planoSaude: planoSaude.trim() || undefined,
        tipoSangue,
        contatoEmergencia: { nome: contatoNome.trim(), telefone: contatoTelefone.trim() },
      });
      setSucessoGeral(true);
    } catch (erro) {
      setErroGeral(mensagemDeErro(erro, 'Não foi possível salvar essas informações.'));
    } finally {
      setSalvandoGeral(false);
    }
  }

  async function adicionarAlergia() {
    if (!novaAlergia.trim()) return;
    const criada = await criarAlergia({ alergia: novaAlergia.trim() });
    setAlergias((atual) => [...atual, criada]);
    setNovaAlergia('');
  }
  async function removerAlergia(id: number) {
    await excluirAlergia(id);
    setAlergias((atual) => atual.filter((a) => a.id !== id));
  }

  async function adicionarMedicamento() {
    if (!novoMedicamento.trim() || !novaDosagem.trim()) return;
    const criado = await criarMedicamento({
      medicamento: novoMedicamento.trim(),
      dosagem: novaDosagem.trim(),
    });
    setMedicamentos((atual) => [...atual, criado]);
    setNovoMedicamento('');
    setNovaDosagem('');
  }
  async function removerMedicamento(id: number) {
    await excluirMedicamento(id);
    setMedicamentos((atual) => atual.filter((m) => m.id !== id));
  }

  async function adicionarDoenca() {
    if (!novaDoenca.trim()) return;
    const criada = await criarDoenca({ doenca: novaDoenca.trim() });
    setDoencas((atual) => [...atual, criada]);
    setNovaDoenca('');
  }
  async function removerDoenca(id: number) {
    await excluirDoenca(id);
    setDoencas((atual) => atual.filter((d) => d.id !== id));
  }

  async function adicionarCirurgia() {
    if (!novaCirurgia.trim()) return;
    const criada = await criarCirurgia({
      cirurgia: novaCirurgia.trim(),
      data: novaCirurgiaAno.trim() || undefined,
    });
    setCirurgias((atual) => [...atual, criada]);
    setNovaCirurgia('');
    setNovaCirurgiaAno('');
  }
  async function removerCirurgia(id: number) {
    await excluirCirurgia(id);
    setCirurgias((atual) => atual.filter((c) => c.id !== id));
  }

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, styles.centro]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Editar informações clínicas" onBack={() => navigation.goBack()} />

        <Input
          label="PLANO DE SAÚDE"
          placeholder="Opcional"
          icon={Building2}
          value={planoSaude}
          onChangeText={setPlanoSaude}
        />

        <Text style={styles.rotulo}>TIPO SANGUÍNEO</Text>
        <View style={styles.chipsLinha}>
          {TIPOS_SANGUE.map((opcao) => (
            <TouchableOpacity
              key={opcao}
              style={[styles.chipPequeno, tipoSangue === opcao && styles.chipSelecionado]}
              onPress={() => setTipoSangue(opcao)}
            >
              <Text style={[styles.chipTexto, tipoSangue === opcao && styles.chipTextoSelecionado]}>
                {opcao}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="CONTATO DE EMERGÊNCIA — NOME"
          icon={Ambulance}
          value={contatoNome}
          onChangeText={setContatoNome}
        />
        <Input
          label="CONTATO DE EMERGÊNCIA — TELEFONE"
          value={contatoTelefone}
          onChangeText={setContatoTelefone}
          keyboardType="phone-pad"
        />

        {erroGeral.length > 0 && <Text style={styles.erro}>{erroGeral}</Text>}
        {sucessoGeral && <Text style={styles.sucesso}>Salvo.</Text>}

        <AppButton
          title={salvandoGeral ? 'Salvando...' : 'Salvar'}
          onPress={salvarGeral}
          disabled={salvandoGeral}
          style={styles.botaoSalvarGeral}
        />

        <SecaoLista
          titulo="CIRURGIAS PRÉVIAS"
          icon={Syringe}
          itens={cirurgias.map((c) => ({
            id: c.id,
            texto: c.data ? `${c.cirurgia} (${c.data})` : c.cirurgia,
          }))}
          onRemover={removerCirurgia}
        >
          <View style={styles.linhaAdicionar}>
            <View style={styles.inputFlex}>
              <Input label="NOVA CIRURGIA" value={novaCirurgia} onChangeText={setNovaCirurgia} />
            </View>
            <View style={styles.inputCurto}>
              <Input
                label="ANO (OPCIONAL)"
                value={novaCirurgiaAno}
                onChangeText={setNovaCirurgiaAno}
                keyboardType="number-pad"
              />
            </View>
          </View>
          <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarCirurgia}>
            <Text style={styles.botaoAdicionarTexto}>Adicionar cirurgia</Text>
          </TouchableOpacity>
        </SecaoLista>

        <SecaoLista
          titulo="DOENÇAS PRÉ-EXISTENTES"
          icon={Stethoscope}
          itens={doencas.map((d) => ({ id: d.id, texto: d.doenca }))}
          onRemover={removerDoenca}
        >
          <Input label="NOVA DOENÇA" value={novaDoenca} onChangeText={setNovaDoenca} />
          <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarDoenca}>
            <Text style={styles.botaoAdicionarTexto}>Adicionar doença</Text>
          </TouchableOpacity>
        </SecaoLista>

        <SecaoLista
          titulo="ALERGIAS A MEDICAMENTOS"
          icon={TriangleAlert}
          itens={alergias.map((a) => ({ id: a.id, texto: a.alergia }))}
          onRemover={removerAlergia}
        >
          <Input label="NOVA ALERGIA" value={novaAlergia} onChangeText={setNovaAlergia} />
          <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarAlergia}>
            <Text style={styles.botaoAdicionarTexto}>Adicionar alergia</Text>
          </TouchableOpacity>
        </SecaoLista>

        <SecaoLista
          titulo="MEDICAMENTOS EM USO"
          icon={Pill}
          itens={medicamentos.map((m) => ({ id: m.id, texto: `${m.medicamento} · ${m.dosagem}` }))}
          onRemover={removerMedicamento}
        >
          <View style={styles.linhaAdicionar}>
            <View style={styles.inputFlex}>
              <Input label="MEDICAMENTO" value={novoMedicamento} onChangeText={setNovoMedicamento} />
            </View>
            <View style={styles.inputCurto}>
              <Input
                label="DOSAGEM"
                placeholder="50mg · 1x dia"
                value={novaDosagem}
                onChangeText={setNovaDosagem}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarMedicamento}>
            <Text style={styles.botaoAdicionarTexto}>Adicionar medicamento</Text>
          </TouchableOpacity>
        </SecaoLista>
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
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  rotulo: {
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
  botaoSalvarGeral: {
    marginBottom: 8,
  },
  secao: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
  },
  secaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  listaVazia: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  itemLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  itemTexto: {
    fontSize: 15,
    color: colors.textPrimary,
    flexShrink: 1,
    paddingRight: 12,
  },
  linhaAdicionar: {
    flexDirection: 'row',
    gap: 10,
  },
  inputFlex: {
    flex: 1.4,
  },
  inputCurto: {
    flex: 1,
  },
  botaoAdicionar: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  botaoAdicionarTexto: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
