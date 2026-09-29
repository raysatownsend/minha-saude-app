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
    // Ausente no primeiro cadastro da senha pública — só é preenchida
    // quando já existe uma e o usuário está trocando (ver Senhas.tsx).
    senhaLogin?: string;
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

// Formato que PUT /usuarios/me aceita — tudo opcional porque é uma
// atualização parcial (o EditarPerfil só manda os campos que existem
// nessa tela; sem senha nenhuma, que tem endpoint próprio).
export interface AtualizarPerfilInput {
    nome?: string;
    sobrenome?: string;
    sexo?: 'Masculino' | 'Feminino' | 'Outro';
    enderecoCompleto?: string;
    planoSaude?: string;
    // Usados pelo EditarClinico (o EditarPerfil não manda esses dois).
    tipoSangue?: TiposSangue;
    contatoEmergencia?: ContatoEmergencia;
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