import { api } from './api';
import {
    AtualizarDoencaInput,
    CriarDoencaInput,
    Doenca,
} from '../models/doencaModel';

export async function listarDoencas(): Promise<Doenca[]> {
    const resposta = await api.get<Doenca[]>('/doencas');
    return resposta.data;
}

export async function criarDoenca(dados: CriarDoencaInput): Promise<Doenca> {
    const resposta = await api.post<Doenca>('/doencas', dados);
    return resposta.data;
}

export async function atualizarDoenca(
    id: number,
    dados: AtualizarDoencaInput,
): Promise<Doenca> {
    const resposta = await api.put<Doenca>(`/doencas/${id}`, dados);
    return resposta.data;
}

export async function excluirDoenca(id: number): Promise<void> {
    await api.delete(`/doencas/${id}`);
}
