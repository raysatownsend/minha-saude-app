import { api } from './api';
import { AlterarSenhaInput, DefinirSenhaPublicaInput, NovoUsuarioInput, Usuario } from '../models/usuarioModel';

export async function cadastrar(dados: NovoUsuarioInput): Promise<Usuario> {
  const resposta = await api.post<Usuario>('/usuarios', dados);
  return resposta.data;
}

export async function obterMeuPerfil(): Promise<Usuario> {
  const resposta = await api.get<Usuario>('/usuarios/me');
  return resposta.data;
}

export async function definirSenhaPublica(dados: DefinirSenhaPublicaInput): Promise<void> {
  await api.put('/usuarios/me/senha-publica', dados);
}

export async function removerSenhaPublica(): Promise<void> {
  await api.delete('/usuarios/me/senha-publica');
}

export async function alterarSenha(dados: AlterarSenhaInput): Promise<void> {
  await api.put('/usuarios/me/senha', dados);
}
