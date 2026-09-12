// src/navigation/types.ts
//
// Lista de telas de cada navegador, com o tipo dos parâmetros que
// cada uma recebe ("undefined" = não recebe nenhum). Isso é o que
// permite o TypeScript avisar se você escrever
// navigation.navigate('Cadsatro') com erro de digitação, ou passar
// um parâmetro que a tela não espera.

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  RecuperarSenha: undefined;
  MainTabs: undefined;
  Exames: undefined;
  Medicos: undefined;
  Senhas: undefined;
  ExcluirConta: undefined;
  PublicaBloqueada: undefined;
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
