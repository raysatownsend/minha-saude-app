import { ContatoEmergencia } from '../models/UsuarioModel';
import { TiposSangue } from './TiposSangue';

// O que a página pública mostra — de propósito bem menor que o
// UsuarioModel inteiro. email, username, password (hash ou não),
// senhaQrCode (hash) e id não aparecem aqui: quem acha o crachá não
// precisa disso, e não tem por que sair do backend pra ninguém.
export interface PerfilPublico {
    nome: string;
    sobrenome: string;
    sexo: 'Masculino' | 'Feminino' | 'Outro';
    tipoSangue: TiposSangue;
    planoSaude: string;
    contatoEmergencia: ContatoEmergencia;
    alergias: string[];
    medicamentos: { medicamento: string; dosagem: string }[];
    doencas: string[];
    cirurgias: { cirurgia: string; data?: string }[];
    medicos: { nome: string; telefone: string; especialidade: string }[];
}
