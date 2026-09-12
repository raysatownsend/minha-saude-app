export interface DoencaModel {
    id: number;
    usuarioId: number;
    doenca: string;
}

export type NovaDoencaInput = Omit<DoencaModel, 'id' | 'usuarioId'>;

export function validarDoencas(dados: NovaDoencaInput): string[] {
    const erros: string[] = [];
    if (!dados.doenca?.trim()) erros.push('Informe os detalhes da doença');

    return erros;
}