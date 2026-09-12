import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../../controllers/AuthController';
import { UsuarioModule } from '../../UsuarioModule';
import { AuthService } from './AuthService';
import { JwtAuthGuard } from './JwtAuthGuard';

@Module({
    imports: [
        ConfigModule,
        UsuarioModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1h' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard],
    exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
