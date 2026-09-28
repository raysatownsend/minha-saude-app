import { api } from './api';
import { LoginInput, LoginResponse } from '../models/auth';

export async function login(dados: LoginInput): Promise<LoginResponse> {
  const resposta = await api.post<LoginResponse>('/auth/login', dados);
  return resposta.data;
}
