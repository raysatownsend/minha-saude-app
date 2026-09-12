import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosRepository } from '../../repositories/UsuariosRepository';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosRepository: UsuariosRepository,
        private readonly jwtService: JwtService,
    ) {}

    async obterJWTToken(username: string, password: string): Promise<{ accessToken: string }> {
        const usuario = await this.usuariosRepository.procurarUsuarioParaAutenticacao(username);

        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            throw new UnauthorizedException('Usuário ou senha inválidos.');
        }

        const accessToken = await this.jwtService.signAsync({
            sub: usuario.id,
            username: usuario.username,
        });

        return { accessToken };
    }
}