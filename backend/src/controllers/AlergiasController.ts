import {
    Body,
    Controller,
    Delete,
    Get,
    Put,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CriarAlergiaDto, AtualizarAlergiaDTO } from '../dtos/SaudeDtos';
import { AlergiaRepository } from '../repositories/AlergiaRepository';
import { JwtAuthGuard } from '../services/auth/JwtAuthGuard';

interface RequisicaoAuth extends Request {
    usuarioId: number;
}

@Controller('alergias')
@UseGuards(JwtAuthGuard)
export class AlergiasController {
    constructor(private readonly alergiaRepository: AlergiaRepository) {}

    @Post()
    async criar(@Req() req: RequisicaoAuth, @Body() dados: CriarAlergiaDto) {

        return this.alergiaRepository.cadastrarNovaAlergia({
            ...dados,
            usuarioId: req.usuarioId,
        });
    }

    @Get()
    listarTodas(@Req() req: RequisicaoAuth) {
        return this.alergiaRepository.listarTodasAlergias(req.usuarioId);
    }

    @Get(':nome')
    async procurarUma(@Param('nome') nome: string, @Req() req: RequisicaoAuth) {
        const alergia = await this.alergiaRepository.procurarAlergia(nome, req.usuarioId);
        if (!alergia) throw new NotFoundException('Alergia não encontrada.');
        return alergia;
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: RequisicaoAuth,
        @Body() dados: AtualizarAlergiaDTO,
    ) {
        const alergia = await this.alergiaRepository.atualizarAlergia(id, req.usuarioId, dados);
        if (!alergia) throw new NotFoundException('Alergia não encontrada.');
        return alergia;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async excluir(@Param('id', ParseIntPipe) id: number, @Req() req: RequisicaoAuth) {
        const excluida = await this.alergiaRepository.excluirAlergia(id, req.usuarioId);
        if (!excluida) throw new NotFoundException('Alergia não encontrada.');
    }
}