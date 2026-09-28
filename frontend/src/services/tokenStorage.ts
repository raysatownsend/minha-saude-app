import * as SecureStore from 'expo-secure-store';

// SecureStore (não AsyncStorage) porque isso é um token de sessão, não
// uma preferência qualquer — no iOS ele usa o Keychain, no Android o
// Keystore, então fica criptografado pelo próprio sistema operacional.
//
// A chave só pode ter letras, números, ".", "-" e "_" — o SecureStore
// valida isso e rejeita qualquer outro caractere (inclusive ":"), então
// nada de separador estilo "namespace:chave" aqui.
const CHAVE_TOKEN = 'minha-saude.accessToken';

export async function salvarToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(CHAVE_TOKEN, token);
}

export async function obterToken(): Promise<string | null> {
  return SecureStore.getItemAsync(CHAVE_TOKEN);
}

export async function removerToken(): Promise<void> {
  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
}
