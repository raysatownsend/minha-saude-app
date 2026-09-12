import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
    sub: number;
    username: string;
}

export interface RequisicaoAutenticada extends Request {
    usuarioId: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<RequisicaoAutenticada>();
        const authorization = request.headers.authorization;
        const [tipo, token] = authorization?.split(' ') ?? [];

        if (tipo !== 'Bearer' || !token) {
            throw new UnauthorizedException('Token Bearer não informado.');
        }

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

            if (!payload.sub) {
                throw new UnauthorizedException('Token inválido.');
            }

            request.usuarioId = payload.sub;
            return true;
        } catch {
            throw new UnauthorizedException('Token inválido ou expirado.');
        }
    }
}