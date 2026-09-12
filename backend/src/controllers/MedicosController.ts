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
import { AtualizarMedicoDto, CriarMedicoDto } from '../dtos/SaudeDtos';
import { MedicosRepository } from '../repositories/MedicosRepository';
import { JwtAuthGuard } from '../services/auth/JwtAuthGuard';

interface RequisicaoAuth extends Request {
    usuarioId: number;
}

@Controller('medicos')
@UseGuards(JwtAuthGuard)
export class MedicosController {
    constructor(private readonly medicosRepository: MedicosRepository) {}

    @Post()
    async criar(@Req() req: RequisicaoAuth, @Body() dados: CriarMedicoDto) {

        return this.medicosRepository.cadastrarNovoMedico({
            ...dados,
            usuarioId: req.usuarioId,
        });
    }

    @Get()
    listarTodos(@Req() req: RequisicaoAuth) {
        return this.medicosRepository.listarTodosMedicos(req.usuarioId);
    }

    @Get(':nome')
    async procurarUm(@Param('nome') nome: string, @Req() req: RequisicaoAuth) {
        const medico = await this.medicosRepository.procurarMedico(nome, req.usuarioId);
        if (!medico) throw new NotFoundException('Médico não encontrado.');
        return medico;
    }

    @Put(':id')
    async atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: RequisicaoAuth,
        @Body() dados: AtualizarMedicoDto,
    ) {
        const medico = await this.medicosRepository.atualizarMedico(id, req.usuarioId, dados);
        if (!medico) throw new NotFoundException('Médico não encontrado.');
        return medico;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async excluir(@Param('id', ParseIntPipe) id: number, @Req() req: RequisicaoAuth) {
        const excluido = await this.medicosRepository.excluirMedico(id, req.usuarioId);
        if (!excluido) throw new NotFoundException('Médico não encontrado.');
    }
}