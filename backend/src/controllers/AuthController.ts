import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../dtos/AuthDtos';
import { AuthService } from '../services/auth/AuthService';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    obterToken(@Body() dados: LoginDto) {
        return this.authService.obterJWTToken(dados.username, dados.password);
    }
}
