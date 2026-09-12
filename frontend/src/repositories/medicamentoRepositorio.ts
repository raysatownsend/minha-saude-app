import { api } from './api';
import {
    AtualizarMedicamentoInput,
    CriarMedicamentoInput,
    Medicamento,
} from '../models/medicamentoModel';

export async function listarMedicamentos(): Promise<Medicamento[]> {
    const resposta = await api.get<Medicamento[]>('/medicamentos');
    return resposta.data;
}

export async function criarMedicamento(
    dados: CriarMedicamentoInput,
): Promise<Medicamento> {
    const resposta = await api.post<Medicamento>('/medicamentos', dados);
    return resposta.data;
}

export async function atualizarMedicamento(
    id: number,
    dados: AtualizarMedicamentoInput,
): Promise<Medicamento> {
    const resposta = await api.put<Medicamento>(`/medicamentos/${id}`, dados);
    return resposta.data;
}

export async function excluirMedicamento(id: number): Promise<void> {
    await api.delete(`/medicamentos/${id}`);
}
