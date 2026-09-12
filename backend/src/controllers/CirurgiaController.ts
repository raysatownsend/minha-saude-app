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
import { AtualizarCirurgiaDto, CriarCirurgiaDto } from '../dtos/SaudeDtos';
import { CirurgiasRepository } from '../repositories/CirurgiasRepository';
import { JwtAuthGuard } from '../services/auth/JwtAuthGuard';

interface RequisicaoAuth extends Request {
    usuarioId: number;
}

@Controller('cirurgias')
@UseGuards(JwtAuthGuard)
export class CirurgiaController {
    constructor(private readonly cirurgiasRepository: CirurgiasRepository) {}

    @Post()
    async criar(@Req() req: RequisicaoAuth, @Body() dados: CriarCirurgiaDto) {

        return this.cirurgiasRepository.cadastrarNovaCirurgia({
            ...dados,
            usuarioId: req.usuarioId,
        });
    }

    @Get()
    listarTodas(@Req() req: RequisicaoAuth) {
        return this.cirurgiasRepository.listarTodasCirurgias(req.usuarioId);
    }

    @Get(':nome')
    async procurarUma(@Param('nome') nome: string, @Req() req: RequisicaoAuth) {
        const cirurgia = await this.cirurgiasRepository.procurarCirurgia(nome, req.usuarioId);
        if (!cirurgia) throw new NotFoundException('Cirurgia não encontrada.');
        return cirurgia;
    }

    @Put(':id')
    async atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: RequisicaoAuth,
        @Body() dados: AtualizarCirurgiaDto,
    ) {
        const cirurgia = await this.cirurgiasRepository.atualizarCirurgia(id, req.usuarioId, dados);
        if (!cirurgia) throw new NotFoundException('Cirurgia não encontrada.');
        return cirurgia;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async excluir(@Param('id', ParseIntPipe) id: number, @Req() req: RequisicaoAuth) {
        const excluida = await this.cirurgiasRepository.excluirCirurgia(id, req.usuarioId);
        if (!excluida) throw new NotFoundException('Cirurgia não encontrada.');
    }
}