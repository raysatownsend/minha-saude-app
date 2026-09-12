import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AtualizarUsuarioDto, CriarUsuarioDto } from '../dtos/UsuarioDtos';
import { UsuariosRepository } from '../repositories/UsuariosRepository';
import { JwtAuthGuard, RequisicaoAutenticada } from '../services/auth/JwtAuthGuard';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosRepository: UsuariosRepository) {}

    @Post()
    async criar(@Body() dados: CriarUsuarioDto) {
        return this.usuariosRepository.cadastrarNovoUsuario(dados);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async obterAtual(@Req() req: RequisicaoAutenticada) {
        const usuario = await this.usuariosRepository.procurarUsuarioPorId(req.usuarioId);
        if (!usuario) throw new NotFoundException('Usuário não encontrado.');
        return usuario;
    }

    @Put('me')
    @UseGuards(JwtAuthGuard)
    async atualizar(@Req() req: RequisicaoAutenticada, @Body() dados: AtualizarUsuarioDto) {
        const usuario = await this.usuariosRepository.atualizarUsuario(req.usuarioId, dados);
        if (!usuario) throw new NotFoundException('Usuário não encontrado.');
        return usuario;
    }

    @Delete('me')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    async excluir(@Req() req: RequisicaoAutenticada) {
        const excluida = await this.usuariosRepository.excluirUsuario(req.usuarioId);
        if (!excluida) throw new NotFoundException('Usuário não encontrada.');
    }
}