export interface MedicamentoModel {
    id: number;
    usuarioId: number;
    medicamento: string;
    dosagem: string;
}

export type NovoMedicamentoInput = Omit<MedicamentoModel, 'id' | 'usuarioId'>;

export function validarMedicamento(dados: NovoMedicamentoInput): string[] {
    const erros: string[] = [];
    if (!dados.medicamento?.trim()) erros.push('Nome do medicamento é obrigatório');
    if (!dados.dosagem?.trim()) erros.push('Dosagem é obrigatória');
    return erros;
}