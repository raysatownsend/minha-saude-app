export interface Usuario {
    nome: string;
    sobrenome: string;
    username: string;
    sexo: 'Masculino' | 'Feminino' | 'Outro'
    enderecoCompleto: string;
    planoSaude: string;
    tipoSangue: TiposSangue;
    contatoEmergencia: ContatoEmergencia;
}

export interface ContatoEmergencia {
    nome: string;
    telefone: string;
}

export type TiposSangue =  
    | 'A+'
    | 'A-'
    | 'B+'
    | 'B-'
    | 'AB+'
    | 'AB-'
    | 'O+'
    | 'O-';