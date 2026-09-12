import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NovaDoencaInput, DoencaModel } from '../models/DoencaModel';
import { Doencas } from '../services/persistencia/entidades/Doencas.entity';

@Injectable()
export class DoencasRepository {
    private readonly doencasRep: Repository<Doencas>;

    constructor(
        @InjectRepository(Doencas)
        doencasRep: Repository<Doencas>
    ) {
        this.doencasRep = doencasRep;
    }

    async cadastrarNovaDoenca(dados: NovaDoencaInput & Pick<DoencaModel, 'usuarioId'>): Promise<DoencaModel> {
        const doencaExistente = await this.procurarDoenca(dados.doenca, dados.usuarioId);
        if (doencaExistente) {
            throw new ConflictException('A doença já está cadastrada.');
        }

        const response = await this.doencasRep.save({
            doenca: dados.doenca,
            usuario: { id: dados.usuarioId },
        });
        return DoencasRepository.createFromObject(response);
    }

    async procurarDoenca(nome: string, usuarioId: number): Promise<DoencaModel | null> {
        const doencaExiste = await this.doencasRep.findOne({
            where: { doenca: nome, usuario: { id: usuarioId } },
        });
        return doencaExiste ? DoencasRepository.createFromObject(doencaExiste) : null;
    }

    async atualizarDoenca(
        id: number,
        usuarioId: number,
        dados: Partial<Pick<NovaDoencaInput, 'doenca'>>,
    ): Promise<DoencaModel | null> {
        const doenca = await this.doencasRep.findOne({
            where: { id, usuario: { id: usuarioId } },
        });
        if (!doenca) return null;

        const response = await this.doencasRep.save({ ...doenca, ...dados, id });
        return DoencasRepository.createFromObject(response);
    }

    async excluirDoenca(id: number, usuarioId: number): Promise<boolean> {
        const resultado = await this.doencasRep.delete({
            id,
            usuario: { id: usuarioId },
        });
        return (resultado.affected ?? 0) > 0;
    }

    async listarTodasDoencas(usuarioId: number): Promise<DoencaModel[]> {
        const response = await this.doencasRep.find({
            where: { usuario: { id: usuarioId } },
        });
        return response.map(doenca => DoencasRepository.createFromObject(doenca));
    }

    static createFromObject(data: Doencas): DoencaModel {
        return { id: data.id, usuarioId: data.usuarioId, doenca: data.doenca };
    }
    
}