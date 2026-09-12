import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NovoMedicamentoInput, MedicamentoModel } from '../models/MedicamentoModel';
import { Medicamentos } from '../services/persistencia/entidades/Medicamentos.entity';

@Injectable()
export class MedicamentosRepository {
    private readonly medicamentosRep: Repository<Medicamentos>

    constructor(
        @InjectRepository(Medicamentos)
        medicamentosRep: Repository<Medicamentos>
    ) {
        this.medicamentosRep = medicamentosRep
    }

    async cadastrarNovoMedicamento(dados: NovoMedicamentoInput & Pick<MedicamentoModel, 'usuarioId'>): Promise<MedicamentoModel> {
        const medicamentoExistente = await this.procurarMedicamento(dados.medicamento, dados.usuarioId);
        if (medicamentoExistente) {
            throw new ConflictException('O medicamento já está cadastrado.');
        }

        const response = await this.medicamentosRep.save({
            medicamento: dados.medicamento,
            dosagem: dados.dosagem,
            usuario: { id: dados.usuarioId },
        });
        return MedicamentosRepository.createFromObject(response);
    }

    async procurarMedicamento(nome: string, usuarioId: number): Promise<MedicamentoModel | null> {
        const medicamentoExiste = await this.medicamentosRep.findOne({
            where: { medicamento: nome, usuario: { id: usuarioId } },
        });
        return medicamentoExiste ? MedicamentosRepository.createFromObject(medicamentoExiste) : null;
    }

    async atualizarMedicamento(
        id: number,
        usuarioId: number,
        dados: Partial<Pick<NovoMedicamentoInput, 'medicamento' | 'dosagem'>>,
    ): Promise<MedicamentoModel | null> {
        const medicamento = await this.medicamentosRep.findOne({
            where: { id, usuario: { id: usuarioId } },
        });
        if (!medicamento) return null;

        const response = await this.medicamentosRep.save({ ...medicamento, ...dados, id });
        return MedicamentosRepository.createFromObject(response);
    }

    async excluirMedicamento(id: number, usuarioId: number): Promise<boolean> {
        const resultado = await this.medicamentosRep.delete({
            id,
            usuario: { id: usuarioId },
        });
        return (resultado.affected ?? 0) > 0;
    }

    async listarTodasMedicamentos(usuarioId: number): Promise<MedicamentoModel[]> {
        const response = await this.medicamentosRep.find({
            where: { usuario: { id: usuarioId } },
        });
        return response.map(medicamento => MedicamentosRepository.createFromObject(medicamento));
    }

    static createFromObject(data: Medicamentos): MedicamentoModel {
        return {
            id: data.id,
            usuarioId: data.usuarioId,
            medicamento: data.medicamento,
            dosagem: data.dosagem,
        };
    }
    
}