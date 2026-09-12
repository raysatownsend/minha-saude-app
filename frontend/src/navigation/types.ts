export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  RecuperarSenha: undefined;
  MainTabs: undefined;
  Exames: undefined;
  Medicos: undefined;
  Senhas: undefined;
  ExcluirConta: undefined;
  // "codigo" vem do próprio link/QR code (ex: .../s/9f27bd) — é o
  // que o deep linking preenche sozinho quando alguém abre o link.
  // Por enquanto a tela não faz nada com ele (não tem backend pra
  // buscar "de quem" é esse código); é o encaixe pronto pra quando
  // existir.
  PublicaBloqueada: { codigo?: string };
  PublicaLiberada: undefined;
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
