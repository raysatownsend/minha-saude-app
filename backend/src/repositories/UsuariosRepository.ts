import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../services/persistencia/entidades/Usuario.entity';
import { UsuarioModel, NovoUsuarioInput, UsuarioResponse } from '../models/UsuarioModel';

@Injectable()
export class UsuariosRepository {
    private readonly usuariosRep: Repository<Usuario>

    constructor(
        @InjectRepository(Usuario)
        usuariosRep: Repository<Usuario>
    ) {
        this.usuariosRep = usuariosRep
    }

    async cadastrarNovoUsuario(dados: NovoUsuarioInput): Promise<UsuarioResponse> {
        const usuarioExistente = await this.usuariosRep.findOne({
            where: { username: dados.username },
        });

        if (usuarioExistente) {
            throw new ConflictException('A usuário já está cadastrada.');
        }

        const response = await this.usuariosRep.save({
            ...dados,
            password: await bcrypt.hash(dados.password, 12),
        });
        return UsuariosRepository.createFromObject(response);
    }

    async procurarUsuario(username: string): Promise<UsuarioResponse | null> {
        const usuarioExiste = await this.usuariosRep.findOne({
            where: {username: username },
        });
        return usuarioExiste ? UsuariosRepository.createFromObject(usuarioExiste) : null;
    }

    async procurarUsuarioParaAutenticacao(username: string): Promise<Usuario | null> {
        return this.usuariosRep.findOne({ where: { username } });
    }

    async procurarUsuarioPorId(id: number): Promise<UsuarioResponse | null> {
        const usuario = await this.usuariosRep.findOne({ where: { id } });
        return usuario ? UsuariosRepository.createFromObject(usuario) : null;
    }

    async atualizarUsuario(
        id: number,
        dados: Partial<NovoUsuarioInput>,
    ): Promise<UsuarioResponse | null> {
        const usuario = await this.usuariosRep.findOne({ where: { id } });
        if (!usuario) return null;

        if (dados.password) {
            dados = { ...dados, password: await bcrypt.hash(dados.password, 12) };
        }

        const response = await this.usuariosRep.save({ ...usuario, ...dados, id });
        return UsuariosRepository.createFromObject(response);
    }

    async excluirUsuario(id: number): Promise<boolean> {
        const excluirUsuario = await this.usuariosRep.delete(
            id === undefined ? { id } : { id },
        );
        return (excluirUsuario.affected ?? 0) > 0;
    }

    async listarTodosUsuarios(): Promise<UsuarioResponse[]> {
        const response = await this.usuariosRep.find();
        return response.map(usuario => UsuariosRepository.createFromObject(usuario))
    }

    static createFromObject(data: Usuario): UsuarioResponse {
        return {
            nome: data.nome,
            sobrenome: data.sobrenome,
            sexo: data.sexo,
            enderecoCompleto: data.enderecoCompleto,
            planoSaude: data.planoSaude,
            contatoEmergencia: {
                nome: data.contatoEmergencia.nome,
                telefone: data.contatoEmergencia.telefone,
            },
            username: data.username,
            tipoSangue: data.tipoSangue,
        };
    }
    
}
