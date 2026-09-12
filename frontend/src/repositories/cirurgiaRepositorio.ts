import { api } from './api';
import {
    AtualizarCirurgiaInput,
    Cirurgia,
    CriarCirurgiaInput,
} from '../models/cirurgiaModel';

export async function listarCirurgias(): Promise<Cirurgia[]> {
    const resposta = await api.get<Cirurgia[]>('/cirurgias');
    return resposta.data;
}

export async function criarCirurgia(dados: CriarCirurgiaInput): Promise<Cirurgia> {
    const resposta = await api.post<Cirurgia>('/cirurgias', dados);
    return resposta.data;
}

export async function atualizarCirurgia(
    id: number,
    dados: AtualizarCirurgiaInput,
): Promise<Cirurgia> {
    const resposta = await api.put<Cirurgia>(`/cirurgias/${id}`, dados);
    return resposta.data;
}

export async function excluirCirurgia(id: number): Promise<void> {
    await api.delete(`/cirurgias/${id}`);
}
