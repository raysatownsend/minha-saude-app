export interface MedicoModel {
    id: number;
    usuarioId: number;
    nome: string;
    telefone: string;
    especialidade: string;
}

export type NovoMedicoInput = Omit<MedicoModel, 'id' | 'usuarioId'>;

export function validarMedico(dados: NovoMedicoInput): string[] {
    const erros: string[] = [];
    if (!dados.nome?.trim()) erros.push('O nome do médico é obrigatório');
    if (!dados.telefone?.trim()) erros.push('O telefone do médico é obrigatório');
    if (!dados.especialidade?.trim()) erros.push('A especialidade do médico é obrigatória');

    return erros;
}