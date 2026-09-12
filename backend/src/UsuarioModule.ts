import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './controllers/UsuariosController';
import { UsuariosRepository } from './repositories/UsuariosRepository';
import { ContatoEmergencia } from './services/persistencia/entidades/ContatoEmergencia.entity';
import { Usuario } from './services/persistencia/entidades/Usuario.entity';
import { JwtAuthGuard } from './services/auth/JwtAuthGuard';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Usuario, ContatoEmergencia]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1h' },
            }),
        }),
    ],
    controllers: [UsuariosController],
    providers: [UsuariosRepository, JwtAuthGuard],
    exports: [UsuariosRepository],
})
export class UsuarioModule {}