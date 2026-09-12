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
import { AtualizarDoencaDto, CriarDoencaDto } from '../dtos/SaudeDtos';
import { DoencasRepository } from '../repositories/DoencasRepository';
import { JwtAuthGuard } from '../services/auth/JwtAuthGuard';

interface RequisicaoAuth extends Request {
    usuarioId: number;
}

@Controller('doencas')
@UseGuards(JwtAuthGuard)
export class DoencasController {
    constructor(private readonly doencasRepository: DoencasRepository) {}

    @Post()
    async criar(@Req() req: RequisicaoAuth, @Body() dados: CriarDoencaDto) {

        return this.doencasRepository.cadastrarNovaDoenca({
            ...dados,
            usuarioId: req.usuarioId,
        });
    }

    @Get()
    listarTodas(@Req() req: RequisicaoAuth) {
        return this.doencasRepository.listarTodasDoencas(req.usuarioId);
    }

    @Get(':nome')
    async procurarUma(@Param('nome') nome: string, @Req() req: RequisicaoAuth) {
        const doenca = await this.doencasRepository.procurarDoenca(nome, req.usuarioId);
        if (!doenca) throw new NotFoundException('Doença não encontrada.');
        return doenca;
    }

    @Put(':id')
    async atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: RequisicaoAuth,
        @Body() dados: AtualizarDoencaDto,
    ) {
        const doenca = await this.doencasRepository.atualizarDoenca(id, req.usuarioId, dados);
        if (!doenca) throw new NotFoundException('Doença não encontrada.');
        return doenca;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async excluir(@Param('id', ParseIntPipe) id: number, @Req() req: RequisicaoAuth) {
        const excluida = await this.doencasRepository.excluirDoenca(id, req.usuarioId);
        if (!excluida) throw new NotFoundException('Doença não encontrada.');
    }
}