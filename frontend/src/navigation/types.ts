import type { PerfilPublico } from '../models/perfilPublicoModel';

export type RootStackParamList = {
  // params só existem quando o Cadastro termina: aviso de sucesso + e-mail já preenchido
  Login: { contaCriada?: boolean; username?: string } | undefined;
  Cadastro: undefined;
  RecuperarSenha: undefined;
  MainTabs: undefined;
  Exames: undefined;
  Medicos: undefined;
  Senhas: undefined;
  ExcluirConta: undefined;
  // "codigo" vem do próprio link/QR code (ex: .../s/9f27bd) — é o
  // que o deep linking preenche sozinho quando alguém abre o link.
  PublicaBloqueada: { codigo?: string };
  // "perfil" chega pela navigation.navigate da PublicaBloqueada, depois
  // que a senha pública confere — nunca buscado direto nesta tela.
  PublicaLiberada: { perfil: PerfilPublico };
  // "item" decide qual card o DetalheClinico mostra — string fixa
  // em vez de passar o ícone/valor direto, porque parâmetro de
  // navegação deveria ser dado simples (texto, número), não um
  // componente React.
  DetalheClinico: { item: 'planoSaude' | 'doencasPreExistentes' };
  EditarClinico: undefined;
  EditarPerfil: undefined;
};

export type MainTabParamList = {
  inicio: undefined;
  clinico: undefined;
  qrcode: undefined;
  perfil: undefined;
};
