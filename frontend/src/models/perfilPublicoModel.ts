// Espelha backend/src/models/perfilPublico.ts. Duplicado de propósito
// — front e back são projetos separados, sem import direto entre eles
// (mesma explicação de quando duplicamos o TipoSanguineo).
export interface PerfilPublico {
  nome: string;
  sobrenome: string;
  sexo: 'Masculino' | 'Feminino' | 'Outro';
  tipoSangue: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  planoSaude: string;
  contatoEmergencia: { nome: string; telefone: string };
  alergias: string[];
  medicamentos: { medicamento: string; dosagem: string }[];
  doencas: string[];
  cirurgias: { cirurgia: string; data?: string }[];
  medicos: { nome: string; telefone: string; especialidade: string }[];
}
