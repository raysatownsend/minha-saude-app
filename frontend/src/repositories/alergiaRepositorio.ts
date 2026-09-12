import { api } from './api';
import { Alergia, CriarAlergiaInput, AtualizarAlergiaInput } from '../models/alergiaModel'


export async function listarAlergias(): Promise<Alergia[]> {
    const resposta = await api.get<Alergia[]>('/alergias');
    return resposta.data;
}

export async function criarAlergia(dados: CriarAlergiaInput): Promise<Alergia> {
    const resposta = await api.post<Alergia>('/alergias', dados);
    return resposta.data;
}

export async function atualizarAlergia(
    id: number,
    dados: AtualizarAlergiaInput,
): Promise<Alergia> {
    const resposta = await api.put<Alergia>(`/alergias/${id}`, dados);
    return resposta.data;
}

export async function excluirAlergia(id: number): Promise<void> {
    await api.delete(`/alergias/${id}`);
}
