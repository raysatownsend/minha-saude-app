import { api } from './api';
import { Medico, CriarMedicoInput, AtualizarMedicoInput } from '../models/medicoModel'


export async function listarMedicos(): Promise<Medico[]> {
    const resposta = await api.get<Medico[]>('/medicos');
    return resposta.data;
}

export async function criarMedico(dados: CriarMedicoInput): Promise<Medico> {
    const resposta = await api.post<Medico>('/medicos', dados);
    return resposta.data;
}

export async function atualizarMedico(
    id: number,
    dados: AtualizarMedicoInput,
): Promise<Medico> {
    const resposta = await api.put<Medico>(`/medicos/${id}`, dados);
    return resposta.data;
}

export async function excluirMedico(id: number): Promise<void> {
    await api.delete(`/medicos/${id}`);
}