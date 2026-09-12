import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NovaAlergiaInput, AlergiaModel } from '../models/AlergiaModel';
import { Alergias } from '../services/persistencia/entidades/Alergias.entity';

@Injectable()
export class AlergiaRepository {
    private readonly alergiasRep: Repository<Alergias>

    constructor(
        @InjectRepository(Alergias)
        alergiasRep: Repository<Alergias>
    ) {
        this.alergiasRep = alergiasRep
    }

    async cadastrarNovaAlergia(dados: NovaAlergiaInput): Promise<AlergiaModel>{
        const alergiaExistente = await this.alergiasRep.findOne({
            where: { alergia: dados.alergia, usuario: { id: dados.usuarioId } },
        });

        if (alergiaExistente) {
            throw new ConflictException('A alergia já está cadastrada.');
        }

        const response = await this.alergiasRep.save({
            alergia: dados.alergia,
            usuario: { id: dados.usuarioId },
        });
        return AlergiaRepository.createFromObject(response);
    }

    async procurarAlergia(nome: string, usuarioId: number): Promise<AlergiaModel | null> {
        const alergiaExiste = await this.alergiasRep.findOne({
            where: { alergia: nome, usuario: { id: usuarioId } },
        });
        return alergiaExiste ? AlergiaRepository.createFromObject(alergiaExiste) : null;
    }

    async atualizarAlergia(
        id: number,
        usuarioId: number,
        dados: Partial<Pick<NovaAlergiaInput, 'alergia'>>,
    ): Promise<AlergiaModel | null> {
        const alergia = await this.alergiasRep.findOne({
            where: { id, usuario: { id: usuarioId } },
        });
        if (!alergia) return null;

        const response = await this.alergiasRep.save({
            ...alergia,
            alergia: dados.alergia ?? alergia.alergia,
        });
        return AlergiaRepository.createFromObject(response);
    }
    

    async excluirAlergia(id: number, usuarioId: number): Promise<boolean> {
        const resultado = await this.alergiasRep.delete({
            id,
            usuario: { id: usuarioId },
        });
        return (resultado.affected ?? 0) > 0;
    }

    async listarTodasAlergias(usuarioId: number): Promise<AlergiaModel[]> {
        const response = await this.alergiasRep.find({ where: { usuario: { id: usuarioId } } });
        return response.map(alergia => AlergiaRepository.createFromObject(alergia))
    }

    static createFromObject(data: Alergias): AlergiaModel {
        return {
            id: data.id,
            usuarioId: data.usuarioId,
            alergia: data.alergia,
        };
    }
    
}
