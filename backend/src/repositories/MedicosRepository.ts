import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NovoMedicoInput, MedicoModel } from '../models/MedicoModel';
import { Medicos } from '../services/persistencia/entidades/Medicos.entity';

@Injectable()
export class MedicosRepository {
    private readonly medicosRep: Repository<Medicos>

    constructor(
        @InjectRepository(Medicos)
        medicosRep: Repository<Medicos>
    ) {
        this.medicosRep = medicosRep
    }

    async cadastrarNovoMedico(dados: NovoMedicoInput & Pick<MedicoModel, 'usuarioId'>): Promise<MedicoModel> {
        const medicoExistente = await this.procurarMedico(dados.nome, dados.usuarioId);
        if (medicoExistente) {
            throw new ConflictException('O médico já está cadastrado.');
        }

        const response = await this.medicosRep.save({
            nome: dados.nome,
            telefone: dados.telefone,
            especialidade: dados.especialidade,
            usuario: { id: dados.usuarioId },
        });
        return MedicosRepository.createFromObject(response);
    }

    async procurarMedico(nome: string, usuarioId: number): Promise<MedicoModel | null> {
        const medicoExiste = await this.medicosRep.findOne({
            where: { nome, usuario: { id: usuarioId } },
        });
        return medicoExiste ? MedicosRepository.createFromObject(medicoExiste) : null;
    }

    async atualizarMedico(
        id: number,
        usuarioId: number,
        dados: Partial<Pick<NovoMedicoInput, 'nome' | 'telefone' | 'especialidade'>>,
    ): Promise<MedicoModel | null> {
        const medico = await this.medicosRep.findOne({
            where: { id, usuario: { id: usuarioId } },
        });
        if (!medico) return null;

        const response = await this.medicosRep.save({ ...medico, ...dados, id });
        return MedicosRepository.createFromObject(response);
    }

    async excluirMedico(id: number, usuarioId: number): Promise<boolean> {
        const resultado = await this.medicosRep.delete({
            id,
            usuario: { id: usuarioId },
        });
        return (resultado.affected ?? 0) > 0;
    }

    async listarTodosMedicos(usuarioId: number): Promise<MedicoModel[]> {
        const response = await this.medicosRep.find({
            where: { usuario: { id: usuarioId } },
        });
        return response.map(medico => MedicosRepository.createFromObject(medico));
    }

    static createFromObject(data: Medicos): MedicoModel {
        return {
            id: data.id,
            usuarioId: data.usuarioId,
            nome: data.nome,
            telefone: data.telefone,
            especialidade: data.especialidade,
        };
    }
    
}