import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
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
            // Gerado aqui, não pelo cliente — é o que vai na URL/QR Code
            // pública, então precisa existir desde a criação da conta.
            linkPublicoId: randomUUID(),
        });
        return UsuariosRepository.createFromObject(response);
    }

    async procurarUsuarioPorLinkPublico(linkPublicoId: string): Promise<Usuario | null> {
        return this.usuariosRep.findOne({ where: { linkPublicoId } });
    }

    async definirSenhaPublica(
    usuarioId: number,
    senhaPublica: string,
    senhaLogin?: string,   // 👈 agora é opcional
    ): Promise<void> {
        const usuario = await this.usuariosRep.findOne({ where: { id: usuarioId } });
        if (!usuario) return;

        // Só exige a senha de login quando já existe uma senha pública, ou seja,
        // quando é uma TROCA. Na primeira definição, o JWT já basta.
        if (usuario.senhaQrCode) {
            if (!senhaLogin || !(await bcrypt.compare(senhaLogin, usuario.password))) {
                throw new UnauthorizedException('Senha de login incorreta.');
            }
        }

        // Compara com o HASH salvo, não com o que veio na requisição. Assim a
        // regra funciona mesmo quando senhaLogin não foi enviada.
        if (await bcrypt.compare(senhaPublica, usuario.password)) {
            throw new BadRequestException('A senha pública precisa ser diferente da senha de login.');
        }

        await this.usuariosRep.save({
            ...usuario,
            senhaQrCode: await bcrypt.hash(senhaPublica, 12),
        });
    }

    async removerSenhaPublica(usuarioId: number): Promise<void> {
        // NULL (não undefined!): o save() do TypeORM ignora propriedades
        // undefined, então a versão anterior desse método "revogava" sem
        // apagar nada — o link continuava funcionando com a senha antiga.
        // Sem hash salvo, nenhuma senha digitada confere, e conta + dados
        // clínicos continuam intactos (Cenário 1 da story de excluir o link).
        await this.usuariosRep.update({ id: usuarioId }, { senhaQrCode: null });
    }

    async alterarSenha(usuarioId: number, senhaAtual: string, novaSenha: string): Promise<void> {
        const usuario = await this.usuariosRep.findOne({ where: { id: usuarioId } });
        if (!usuario) return;

        const senhaAtualConfere = await bcrypt.compare(senhaAtual, usuario.password);
        if (!senhaAtualConfere) {
            throw new UnauthorizedException('Senha atual incorreta.');
        }

        await this.usuariosRep.save({
            ...usuario,
            password: await bcrypt.hash(novaSenha, 12),
        });
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

        // Senha de login não se troca por aqui — ver alterarSenha() logo
        // abaixo, que exige a senha atual antes de aceitar uma nova.
        const { password, contatoEmergencia, ...demaisDados } = dados;

        const response = await this.usuariosRep.save({
            ...usuario,
            ...demaisDados,
            id,
            // O contato que chega do app não tem "id" (o DTO não aceita),
            // e sem id o cascade do TypeORM CRIARIA um contato novo,
            // deixando o antigo abandonado no banco. Juntando com o
            // contato atual, o id é mantido e a linha existente é atualizada.
            contatoEmergencia: contatoEmergencia
                ? { ...usuario.contatoEmergencia, ...contatoEmergencia }
                : usuario.contatoEmergencia,
        });
        return UsuariosRepository.createFromObject(response);
    }

    async excluirUsuario(id: number): Promise<boolean> {
        const excluirUsuario = await this.usuariosRep.delete({ id });
        return (excluirUsuario.affected ?? 0) > 0;
    }

    async listarTodosUsuarios(): Promise<UsuarioResponse[]> {
        const response = await this.usuariosRep.find();
        return response.map(usuario => UsuariosRepository.createFromObject(usuario))
    }

    static createFromObject(data: Usuario): UsuarioResponse {
        return {
            id: data.id,
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
            linkPublicoId: data.linkPublicoId,
            temSenhaPublica: Boolean(data.senhaQrCode),
        };
    }
    
}
