import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NovaCirurgiaInput, CirurgiaModel } from '../models/CirurgiaModel';
import { Cirurgias } from '../services/persistencia/entidades/Cirurgias.entity';

@Injectable()
export class CirurgiasRepository {
    private readonly cirurgiasRep: Repository<Cirurgias>

    constructor(
        @InjectRepository(Cirurgias)
        cirurgiasRep: Repository<Cirurgias>,
    ) {
        this.cirurgiasRep = cirurgiasRep
    }

    async cadastrarNovaCirurgia(
        dados: NovaCirurgiaInput & Pick<CirurgiaModel, 'usuarioId'>,
    ): Promise<CirurgiaModel>{
        const cirurgiaExistente = await this.procurarCirurgia(dados.cirurgia, dados.usuarioId);
        if (cirurgiaExistente) {
            throw new ConflictException('A cirurgia já está cadastrada.');
        }

        const response = await this.cirurgiasRep.save({
            cirurgia: dados.cirurgia,
            data: dados.data,
            usuario: { id: dados.usuarioId },
        });
        return CirurgiasRepository.createFromObject(response);
    }

    async procurarCirurgia(nome: string, usuarioId: number): Promise<CirurgiaModel | null> {
        const cirurgiaExiste = await this.cirurgiasRep.findOne({
            where: { cirurgia: nome, usuario: { id: usuarioId } },
        });
        return cirurgiaExiste ? CirurgiasRepository.createFromObject(cirurgiaExiste) : null;
    }

    async atualizarCirurgia(
        id: number,
        usuarioId: number,
        dados: Partial<Pick<NovaCirurgiaInput, 'cirurgia' | 'data'>>,
    ): Promise<CirurgiaModel | null> {
        const cirurgia = await this.cirurgiasRep.findOne({
            where: { id, usuario: { id: usuarioId } },
        });
        if (!cirurgia) return null;

        const response = await this.cirurgiasRep.save({ ...cirurgia, ...dados, id });
        return CirurgiasRepository.createFromObject(response);
    }

    async excluirCirurgia(id: number, usuarioId: number): Promise<boolean> {
        const resultado = await this.cirurgiasRep.delete({
            id,
            usuario: { id: usuarioId },
        });
        return (resultado.affected ?? 0) > 0;
    }

    async listarTodasCirurgias(usuarioId: number): Promise<CirurgiaModel[]> {
        const response = await this.cirurgiasRep.find({ where: { usuario: { id: usuarioId } } });
        return response.map(cirurgia => CirurgiasRepository.createFromObject(cirurgia))
    }

    static createFromObject(data: Cirurgias): CirurgiaModel {
        return { id: data.id, cirurgia: data.cirurgia, usuarioId: data.usuarioId, data: data.data};
    }
    
}