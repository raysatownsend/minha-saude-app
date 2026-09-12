export interface CirurgiaModel {
    id: number;
    usuarioId: number;
    cirurgia: string;
    data?: string;
}

export type NovaCirurgiaInput = Omit<CirurgiaModel, 'id' | 'usuarioId'>;

export function validarCirurgia(dados: NovaCirurgiaInput): string[] {
    const erros: string[] = [];
    if (!dados.cirurgia?.trim()) erros.push('Informe os detalhes de cirurgia');

    return erros;
}