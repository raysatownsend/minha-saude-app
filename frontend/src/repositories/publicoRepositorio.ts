import { api } from './api';
import { PerfilPublico } from '../models/perfilPublicoModel';

export async function verificarSenhaPublica(
  codigo: string,
  senha: string,
): Promise<PerfilPublico> {
  const resposta = await api.post<PerfilPublico>(`/publico/${codigo}/verificar`, { senha });
  return resposta.data;
}
