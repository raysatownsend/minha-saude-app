// colors.ts
// Paleta extraída pixel a pixel das suas telas (mesmos valores de
// antes — agora só em TypeScript, pra combinar com o resto do projeto).
//
// Coloca este arquivo na RAIZ do projeto, do lado do App.tsx — é o
// caminho que o Input.tsx já está esperando: import { colors } from '../../colors'

export const colors = {
  // ---- Neutros (usados em toda tela) ----
  background: 'rgb(240, 248, 248)',    // fundo geral (login, home, perfil...)
  card: 'rgb(248, 248, 248)',          // fundo de inputs, cards, nav bar
  textPrimary: 'rgb(8, 32, 48)',       // títulos, texto principal escuro
  textSecondary: 'rgb(100, 124, 132)', // legendas, labels (E-MAIL, SENHA)

  // ---- Marca ----
  primary: 'rgb(72, 184, 224)',        // botão Entrar, ícones, links, aba ativa

  // ---- Gradiente (splash + cabeçalho da Home) ----
  gradientStart: 'rgb(112, 208, 224)', // azul, início do gradiente
  gradientEnd: 'rgb(128, 224, 200)',   // verde-água, fim do gradiente

  // ---- Semânticas (cada uma com uma versão forte e uma clara) ----
  success: 'rgb(120, 216, 168)',       // botão Compartilhar / Salvar senha pública
  successLight: 'rgb(208, 248, 224)',  // banner "Protegido por senha pública"

  danger: 'rgb(228, 96, 96)',          // ícone/texto de alerta, ligação de emergência
  dangerLight: 'rgb(248, 224, 224)',   // fundo do botão Excluir, box "ALERGIAS GRAVES"

  warning: 'rgb(224, 160, 48)',        // ícone do badge de alergias
  warningLight: 'rgb(248, 240, 208)',  // fundo do badge de alergias

  infoLight: 'rgb(208, 240, 248)',     // fundo do badge de idade
} as const;
// "as const" trava cada valor como um literal exato em vez de só
// `string` — o TypeScript passa a saber que colors.primary É
// 'rgb(72, 184, 224)', o que ajuda o autocomplete e acusa erro de
// digitação se você errar um nome de propriedade em algum lugar.