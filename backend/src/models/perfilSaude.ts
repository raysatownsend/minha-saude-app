export type TiposSangue = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Alergias {
    id: number;
    alergia: string;
}

export interface Medicamentos {
    id: number;
    medicamento: string;
}

export interface Doencas {
    id: number;
    doença: string;
}

export interface Cirurgias {
    id: number;
    cirurgia: string;
    data?: string;
}

export interface ContatoEmergencia {
    nome: string;
    telefone: string;
}

export interface PerfilSaude {
    nome: string;
    username: string;
    sobrenome: string;
    sexo: 'Masculino' | 'Feminino' | 'Outro';
    alergias: Alergias[];
    medicamentos: Medicamentos[];
    planoSaude: string;
    doencas: Doencas[];
    cirurgia: Cirurgias[];
    contatoEmergencia: ContatoEmergencia;
    tipoSangue: TiposSangue;
}