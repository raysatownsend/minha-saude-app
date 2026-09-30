import type { AxiosError } from 'axios';

type CorpoDeErro = { message?: string | string[] };

interface Opcoes {
  // texto próprio pro 409 (conflito), no lugar da mensagem que vem do backend
  conflito?: string;
}

// Traduz um erro de requisição na mensagem que diz O QUE deu errado — em vez
// de um "não foi possível..." igual pra tudo, que não deixava saber se o
// problema era o backend fora do ar, um erro dentro dele ou um dado inválido.
export function mensagemDeErro(erro: unknown, padrao: string, opcoes: Opcoes = {}): string {
  // Não é erro de requisição (é um bug no próprio código): não culpar a rede.
  if ((erro as { isAxiosError?: boolean } | null)?.isAxiosError !== true) {
    if (__DEV__) console.log('[api] erro que não veio da requisição:', erro);
    return padrao;
  }

  const e = erro as AxiosError<CorpoDeErro>;
  const endereco = `${e.config?.baseURL ?? ''}${e.config?.url ?? ''}`;

  if (__DEV__) {
    // aparece no terminal do Expo — é o trecho que vale colar quando algo falha
    console.log('[api] falha:', (e.config?.method ?? '').toUpperCase(), endereco, '->', e.response?.status ?? e.code ?? e.message);
  }

  // Sem resposta = a requisição nem chegou no backend (ou ele não respondeu a tempo).
  if (!e.response) {
    if (e.code === 'ECONNABORTED') return 'O servidor demorou demais para responder. Tente novamente.';
    return __DEV__
      ? `Não consegui falar com o servidor em ${e.config?.baseURL ?? '(endereço desconhecido)'}. Confira se o backend está rodando e se o EXPO_PUBLIC_API_URL está certo.`
      : 'Não consegui falar com o servidor. Verifique sua conexão e tente novamente.';
  }

  const status = e.response.status;
  const corpo = e.response.data?.message;
  const doBackend =
    typeof corpo === 'string' ? corpo : Array.isArray(corpo) && corpo.length > 0 ? corpo[0] : undefined;

  if (status === 409) return opcoes.conflito ?? doBackend ?? padrao;
  if (status === 400 || status === 401) return doBackend ?? padrao;
  if (status >= 500) {
    return __DEV__
      ? `Erro interno no servidor (${status}). Veja o terminal do backend: o motivo aparece lá.`
      : 'Erro no servidor. Tente novamente em instantes.';
  }
  if (status === 404) return __DEV__ ? `Endereço da API não encontrado (404): ${endereco}` : padrao;
  return padrao;
}
