import { TiposSangue, TIPOS_SANGUE_VALIDOS } from "./TiposSangue";

export interface ContatoEmergencia {
    nome: string;
    telefone: string;
}

export interface UsuarioModel {
    id: number;
    nome: string;
    username: string;
    sobrenome: string;
    password: string;
    senhaQrCode?: string;
    linkPublicoId: string;
    sexo: 'Masculino' | 'Feminino' | 'Outro';
    enderecoCompleto: string;
    // Opcional desde a Fase 1 (critério de aceite da story de
    // informações clínicas: "Plano de saúde em branco... deve aceitar
    // normalmente") — a coluna no banco também é nullable agora.
    planoSaude?: string;
    contatoEmergencia: ContatoEmergencia;
    tipoSangue: TiposSangue;
}

// linkPublicoId nunca vem do cliente: é gerado no cadastro (ver
// UsuariosRepository). senhaQrCode também sai daqui — quem define isso
// agora é o endpoint dedicado PUT /usuarios/me/senha-publica, que exige
// confirmar com a senha de login (ver DefinirSenhaPublicaDto).
export type NovoUsuarioInput = Omit<UsuarioModel, 'id' | 'linkPublicoId' | 'senhaQrCode'>;
// temSenhaPublica é calculado (Boolean(senhaQrCode)) — a tela do QR Code
// precisa saber SE existe senha pública configurada, sem que o hash em
// si nunca precise sair do backend.
export type UsuarioResponse = Omit<UsuarioModel, 'password' | 'senhaQrCode'> & {
    temSenhaPublica: boolean;
};

export function validaUsuario(usuario: NovoUsuarioInput): string[] {
    const erros: string[] = []
    if (!usuario.nome?.trim()) erros.push('O nome é obrigatório');
    if (!usuario.sobrenome?.trim()) erros.push('O sobrenome é obrigatório');
    if (!usuario.username?.trim()) erros.push('O nome de usuário é obrigatório');
    if (!usuario.password?.trim()) erros.push('A senha do aplicativo é obrigatória');
    if (!usuario.contatoEmergencia?.nome?.trim() || !usuario.contatoEmergencia?.telefone?.trim()) {
        erros.push('É obrigatório informar um contato de emergência');
    }

    if (!TIPOS_SANGUE_VALIDOS.includes(usuario.tipoSangue)) erros.push('Tipo sanguíneo inválido.');
    return erros;
}