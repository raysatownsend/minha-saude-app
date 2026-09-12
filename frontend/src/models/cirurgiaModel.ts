export interface Cirurgia {
    id: number;
    cirurgia: string;
    data?: string;
}

export interface CriarCirurgiaInput {
    cirurgia: string;
    data?: string;
}

export interface AtualizarCirurgiaInput {
    cirurgia?: string;
    data?: string;
}