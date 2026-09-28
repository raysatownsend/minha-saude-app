export interface Usuario {
    id: number;
    nome: string;
    sobrenome: string;
    username: string;
    sexo: 'Masculino' | 'Feminino' | 'Outro'
    enderecoCompleto: string;
    planoSaude: string;
    tipoSangue: TiposSangue;
    contatoEmergencia: ContatoEmergencia;
    // Compõe o link/QR Code público: https://minhasaude.app/s/{linkPublicoId}
    linkPublicoId: string;
    // Calculado pelo backend — diz se existe senha pública configurada,
    // sem nunca mandar o hash em si pro app.
    temSenhaPublica: boolean;
}

export interface DefinirSenhaPublicaInput {
    senhaPublica: string;
    senhaLogin: string;
}

export interface AlterarSenhaInput {
    senhaAtual: string;
    novaSenha: string;
}

// Formato que POST /usuarios espera. id, linkPublicoId e temSenhaPublica
// ficam de fora — o backend é quem decide esses três (ver o comentário
// equivalente no NovoUsuarioInput do backend).
export interface NovoUsuarioInput {
    nome: string;
    sobrenome: string;
    username: string;
    password: string;
    sexo: 'Masculino' | 'Feminino' | 'Outro';
    enderecoCompleto: string;
    planoSaude?: string;
    contatoEmergencia: ContatoEmergencia;
    tipoSangue: TiposSangue;
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