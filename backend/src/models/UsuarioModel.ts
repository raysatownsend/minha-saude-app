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
    sexo: 'Masculino' | 'Feminino' | 'Outro';
    enderecoCompleto: string;
    planoSaude: string;
    contatoEmergencia: ContatoEmergencia;
    tipoSangue: TiposSangue;
}

export type NovoUsuarioInput = Omit<UsuarioModel, 'id'>;
export type UsuarioResponse = Omit<UsuarioModel, 'id' | 'password' | 'senhaQrCode'>;

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