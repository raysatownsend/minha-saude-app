export interface Medico {
    id: number;
    nome: string;
    telefone: string;
    especialidade: string;
}

export interface CriarMedicoInput {
    nome: string;
    telefone: string;
    especialidade: string;
}

export interface AtualizarMedicoInput {
    nome?: string;
    telefone?: string;
    especialidade?: string;
}