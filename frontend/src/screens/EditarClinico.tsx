// src/screens/EditarClinico.tsx
//
// Formulário de edição das informações clínicas. Antes os campos
// começavam com textos fixos do protótipo (Unimed, O+, Dipirona...);
// agora tudo é carregado da API ao abrir a tela.
//
// Duas formas de salvar, porque os dados moram em lugares diferentes
// no backend:
//   - Plano de saúde, tipo sanguíneo e contato de emergência são
//     campos do USUÁRIO → salvos juntos pelo botão "Salvar"
//     (PUT /usuarios/me).
//   - Alergias, medicamentos, doenças e cirurgias são LISTAS, cada
//     item é um registro próprio no banco → cada item é adicionado ou
//     removido na hora, pelos hooks (useAlergias etc.).

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Ambulance,
  Building2,
  Droplet,
  Phone,
  Pill,
  Plus,
  Stethoscope,
  Syringe,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import Input from '../components/Input';
import { colors } from '../../colors';
import { atualizarPerfil, obterMeuPerfil } from '../repositories/usuarioRepositorio';
import { mensagemDeErro } from '../services/erroApi';
import type { TiposSangue } from '../models/usuarioModel';
import { useAlergias } from '../hooks/useAlergias';
import { useMedicamentos } from '../hooks/useMedicamentos';
import { useDoencas } from '../hooks/useDoencas';
import { useCirurgias } from '../hooks/useCirurgias';

// Mesma lista que o backend aceita (TIPOS_SANGUE_VALIDOS). Botões em vez
// de texto livre: se a pessoa digitasse "o positivo", o backend recusaria.
const TIPOS_SANGUE: TiposSangue[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function EditarClinico() {
  const navigation = useNavigation();

  // Começam VAZIOS. Os valores de verdade chegam no useEffect abaixo.
  const [planoSaude, setPlanoSaude] = useState('');
  const [tipoSangue, setTipoSangue] = useState<TiposSangue | null>(null);
  const [contatoNome, setContatoNome] = useState('');
  const [contatoTelefone, setContatoTelefone] = useState('');
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [salvando, setSalvando] = useState(false);
  // Mesmo padrão do EditarPerfil: a mensagem aparece na própria tela,
  // abaixo do cabeçalho.
  const [erro, setErro] = useState('');

  // Os hooks já buscam as listas sozinhos quando a tela abre.
  const alergias = useAlergias();
  const medicamentos = useMedicamentos();
  const doencas = useDoencas();
  const cirurgias = useCirurgias();

  // Textos digitados nos campos de "adicionar" de cada lista.
  const [novaAlergia, setNovaAlergia] = useState('');
  const [novoMedicamento, setNovoMedicamento] = useState('');
  const [novaDosagem, setNovaDosagem] = useState('');
  const [novaDoenca, setNovaDoenca] = useState('');
  const [novaCirurgia, setNovaCirurgia] = useState('');
  const [novaDataCirurgia, setNovaDataCirurgia] = useState('');

  useEffect(() => {
    obterMeuPerfil()
      .then((perfil) => {
        setPlanoSaude(perfil.planoSaude ?? '');
        setTipoSangue(perfil.tipoSangue);
        setContatoNome(perfil.contatoEmergencia?.nome ?? '');
        setContatoTelefone(perfil.contatoEmergencia?.telefone ?? '');
      })
      .catch((erroApi) =>
        setErro(mensagemDeErro(erroApi, 'Não foi possível carregar suas informações.')),
      )
      .finally(() => setCarregandoPerfil(false));
  }, []);

  async function salvar() {
    if (!contatoNome.trim() || !contatoTelefone.trim()) {
      setErro('Preencha o nome e o telefone do contato de emergência.');
      return;
    }

    setErro('');
    setSalvando(true);
    try {
      await atualizarPerfil({
        // O backend recusa planoSaude vazio (""), então nesse caso o
        // campo nem é enviado e o valor antigo é mantido.
        planoSaude: planoSaude.trim() || undefined,
        tipoSangue: tipoSangue ?? undefined,
        contatoEmergencia: {
          nome: contatoNome.trim(),
          telefone: contatoTelefone.trim(),
        },
      });
      navigation.goBack();
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, 'Não foi possível salvar as alterações.'));
    } finally {
      setSalvando(false);
    }
  }

  // Envolve as ações das listas: mostra a mensagem de erro se a API
  // falhar, em vez de a tela simplesmente "não fazer nada". O 409 é o
  // backend avisando que o item já existe (ex.: alergia repetida).
  async function executar(acao: () => Promise<void>) {
    setErro('');
    try {
      await acao();
    } catch (erroApi) {
      setErro(
        mensagemDeErro(erroApi, 'Não foi possível concluir a ação. Tente novamente.', {
          conflito: 'Esse item já está cadastrado.',
        }),
      );
    }
  }

  if (carregandoPerfil) {
    return (
      <SafeAreaView style={[styles.container, styles.centralizado]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <ScreenHeader
          title="Editar informações clínicas"
          onBack={() => navigation.goBack()}
          rightLabel={salvando ? 'Salvando...' : 'Salvar'}
          onRightPress={salvando ? undefined : salvar}
        />

        {erro.length > 0 && <Text style={styles.erro}>{erro}</Text>}

        <Input
          label="PLANO DE SAÚDE"
          icon={Building2}
          value={planoSaude}
          onChangeText={setPlanoSaude}
          placeholder="Ex.: Unimed · 0123 4567 8901"
        />

        <Text style={styles.label}>TIPO SANGUÍNEO</Text>
        <View style={styles.chips}>
          {TIPOS_SANGUE.map((tipo) => {
            const selecionado = tipo === tipoSangue;
            return (
              <TouchableOpacity
                key={tipo}
                style={[styles.chip, selecionado && styles.chipSelecionado]}
                onPress={() => setTipoSangue(tipo)}
              >
                <Droplet color={selecionado ? '#fff' : colors.primary} size={14} />
                <Text style={[styles.chipTexto, selecionado && styles.chipTextoSelecionado]}>
                  {tipo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Input
          label="CONTATO DE EMERGÊNCIA · NOME"
          icon={Ambulance}
          value={contatoNome}
          onChangeText={setContatoNome}
        />
        <Input
          label="CONTATO DE EMERGÊNCIA · TELEFONE"
          icon={Phone}
          value={contatoTelefone}
          onChangeText={setContatoTelefone}
          keyboardType="phone-pad"
        />

        <Text style={styles.aviso}>
          As listas abaixo são salvas na hora, ao adicionar ou remover um item.
        </Text>

        <SecaoLista
          titulo="ALERGIAS A MEDICAMENTOS"
          icon={TriangleAlert}
          carregando={alergias.carregando}
          itens={alergias.alergias.map((a) => ({ id: a.id, texto: a.alergia }))}
          onRemover={(id) => executar(() => alergias.remover(id))}
        >
          <CampoAdicionar
            placeholder="Nova alergia"
            valor={novaAlergia}
            onChange={setNovaAlergia}
            onAdicionar={() =>
              executar(async () => {
                await alergias.adicionar({ alergia: novaAlergia.trim() });
                setNovaAlergia('');
              })
            }
            podeAdicionar={novaAlergia.trim().length > 0}
          />
        </SecaoLista>

        <SecaoLista
          titulo="MEDICAMENTOS EM USO"
          icon={Pill}
          carregando={medicamentos.carregando}
          itens={medicamentos.medicamentos.map((m) => ({
            id: m.id,
            texto: `${m.medicamento} · ${m.dosagem}`,
          }))}
          onRemover={(id) => executar(() => medicamentos.remover(id))}
        >
          <CampoAdicionar
            placeholder="Medicamento"
            valor={novoMedicamento}
            onChange={setNovoMedicamento}
            segundoPlaceholder="Dosagem (ex.: 50mg · 1x dia)"
            segundoValor={novaDosagem}
            onSegundoChange={setNovaDosagem}
            onAdicionar={() =>
              executar(async () => {
                await medicamentos.adicionar({
                  medicamento: novoMedicamento.trim(),
                  dosagem: novaDosagem.trim(),
                });
                setNovoMedicamento('');
                setNovaDosagem('');
              })
            }
            // O backend exige os dois campos preenchidos.
            podeAdicionar={novoMedicamento.trim().length > 0 && novaDosagem.trim().length > 0}
          />
        </SecaoLista>

        <SecaoLista
          titulo="DOENÇAS PRÉ-EXISTENTES"
          icon={Stethoscope}
          carregando={doencas.carregando}
          itens={doencas.doencas.map((d) => ({ id: d.id, texto: d.doenca }))}
          onRemover={(id) => executar(() => doencas.remover(id))}
        >
          <CampoAdicionar
            placeholder="Nova doença"
            valor={novaDoenca}
            onChange={setNovaDoenca}
            onAdicionar={() =>
              executar(async () => {
                await doencas.adicionar({ doenca: novaDoenca.trim() });
                setNovaDoenca('');
              })
            }
            podeAdicionar={novaDoenca.trim().length > 0}
          />
        </SecaoLista>

        <SecaoLista
          titulo="CIRURGIAS PRÉVIAS"
          icon={Syringe}
          carregando={cirurgias.carregando}
          itens={cirurgias.cirurgias.map((c) => ({
            id: c.id,
            texto: c.data ? `${c.cirurgia} (${c.data})` : c.cirurgia,
          }))}
          onRemover={(id) => executar(() => cirurgias.remover(id))}
        >
          <CampoAdicionar
            placeholder="Cirurgia"
            valor={novaCirurgia}
            onChange={setNovaCirurgia}
            segundoPlaceholder="Data (opcional)"
            segundoValor={novaDataCirurgia}
            onSegundoChange={setNovaDataCirurgia}
            onAdicionar={() =>
              executar(async () => {
                await cirurgias.adicionar({
                  cirurgia: novaCirurgia.trim(),
                  // Data é opcional: string vazia vira undefined e nem é enviada.
                  data: novaDataCirurgia.trim() || undefined,
                });
                setNovaCirurgia('');
                setNovaDataCirurgia('');
              })
            }
            podeAdicionar={novaCirurgia.trim().length > 0}
          />
        </SecaoLista>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------
// Componentes pequenos usados só nesta tela. As quatro listas têm o
// mesmo formato (título, itens com "X", campo de adicionar), então em
// vez de repetir o mesmo JSX quatro vezes, ele fica escrito uma vez só.
// ---------------------------------------------------------------------

interface ItemLista {
  id: number;
  texto: string;
}

interface SecaoListaProps {
  titulo: string;
  icon: LucideIcon;
  carregando: boolean;
  itens: ItemLista[];
  onRemover: (id: number) => void;
  children: React.ReactNode; // o CampoAdicionar de cada lista
}

function SecaoLista({ titulo, icon: Icon, carregando, itens, onRemover, children }: SecaoListaProps) {
  return (
    <View style={styles.secao}>
      <Text style={styles.label}>{titulo}</Text>

      {carregando ? (
        <ActivityIndicator color={colors.primary} style={styles.carregandoLista} />
      ) : itens.length === 0 ? (
        <Text style={styles.vazio}>Nenhum item cadastrado.</Text>
      ) : (
        itens.map((item) => (
          <View key={item.id} style={styles.item}>
            <Icon color={colors.primary} size={18} />
            <Text style={styles.itemTexto}>{item.texto}</Text>
            <TouchableOpacity onPress={() => onRemover(item.id)} hitSlop={8}>
              <X color={colors.textSecondary} size={18} />
            </TouchableOpacity>
          </View>
        ))
      )}

      {children}
    </View>
  );
}

interface CampoAdicionarProps {
  placeholder: string;
  valor: string;
  onChange: (texto: string) => void;
  // Segundo campo opcional (dosagem do medicamento, data da cirurgia).
  segundoPlaceholder?: string;
  segundoValor?: string;
  onSegundoChange?: (texto: string) => void;
  onAdicionar: () => void;
  podeAdicionar: boolean;
}

function CampoAdicionar({
  placeholder,
  valor,
  onChange,
  segundoPlaceholder,
  segundoValor,
  onSegundoChange,
  onAdicionar,
  podeAdicionar,
}: CampoAdicionarProps) {
  return (
    <View style={styles.adicionarLinha}>
      <View style={styles.adicionarCampos}>
        <TextInput
          style={styles.adicionarInput}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={valor}
          onChangeText={onChange}
        />
        {onSegundoChange && (
          <TextInput
            style={styles.adicionarInput}
            placeholder={segundoPlaceholder}
            placeholderTextColor={colors.textSecondary}
            value={segundoValor}
            onChangeText={onSegundoChange}
          />
        )}
      </View>
      <TouchableOpacity
        style={[styles.adicionarBotao, !podeAdicionar && styles.desabilitado]}
        onPress={onAdicionar}
        disabled={!podeAdicionar}
      >
        <Plus color="#fff" size={18} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centralizado: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  erro: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipSelecionado: {
    backgroundColor: colors.primary,
  },
  chipTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chipTextoSelecionado: {
    color: '#fff',
  },
  aviso: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 24,
  },
  secao: {
    marginTop: 8,
  },
  carregandoLista: {
    marginVertical: 12,
  },
  vazio: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  itemTexto: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  adicionarLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adicionarCampos: {
    flex: 1,
    gap: 8,
  },
  adicionarInput: {
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  adicionarBotao: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desabilitado: {
    opacity: 0.4,
  },
});
