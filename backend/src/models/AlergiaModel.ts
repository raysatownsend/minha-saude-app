export interface AlergiaModel {
    id: number;
    usuarioId: number;
    alergia: string;
}

export type NovaAlergiaInput = Omit<AlergiaModel, 'id'>;

export function validarAlergia(dados: NovaAlergiaInput): string[] {
    const erros: string[] = [];
    if (!dados.alergia?.trim()) erros.push('Informe ao menos uma alergia');
    return erros;
}