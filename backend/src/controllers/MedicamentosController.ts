import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
    Put,
} from '@nestjs/common';
import { Request } from 'express';
import { AtualizarMedicamentoDto, CriarMedicamentoDto } from '../dtos/SaudeDtos';
import { MedicamentosRepository } from '../repositories/MedicamentoRepository';
import { JwtAuthGuard } from '../services/auth/JwtAuthGuard';

interface RequisicaoAuth extends Request {
    usuarioId: number;
}

@Controller('medicamentos')
@UseGuards(JwtAuthGuard)
export class MedicamentosController {
    constructor(private readonly medicamentosRepository: MedicamentosRepository) {}

    @Post()
    async criar(@Req() req: RequisicaoAuth, @Body() dados: CriarMedicamentoDto) {

        return this.medicamentosRepository.cadastrarNovoMedicamento({
            ...dados,
            usuarioId: req.usuarioId,
        });
    }

    @Get()
    listarTodas(@Req() req: RequisicaoAuth) {
        return this.medicamentosRepository.listarTodasMedicamentos(req.usuarioId);
    }

    @Get(':nome')
    async procurarUma(@Param('nome') nome: string, @Req() req: RequisicaoAuth) {
        const medicamento = await this.medicamentosRepository.procurarMedicamento(nome, req.usuarioId);
        if (!medicamento) throw new NotFoundException('Medicamento não encontrado.');
        return medicamento;
    }

    @Put(':id')
    async atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: RequisicaoAuth,
        @Body() dados: AtualizarMedicamentoDto,
    ) {
        const medicamento = await this.medicamentosRepository.atualizarMedicamento(id, req.usuarioId, dados);
        if (!medicamento) throw new NotFoundException('Medicamento não encontrado.');
        return medicamento;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async excluir(@Param('id', ParseIntPipe) id: number, @Req() req: RequisicaoAuth) {
        const excluido = await this.medicamentosRepository.excluirMedicamento(id, req.usuarioId);
        if (!excluido) throw new NotFoundException('Medicamento não encontrado.');
    }
}