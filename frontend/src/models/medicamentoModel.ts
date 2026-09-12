export interface Medicamento {
    id: number;
    medicamento: string;
    dosagem: string;
}

export interface CriarMedicamentoInput {
    medicamento: string;
    dosagem: string;
}

export interface AtualizarMedicamentoInput {
    medicamento?: string;
    dosagem?: string;
}