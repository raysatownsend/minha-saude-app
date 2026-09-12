import { AuthModule } from './services/auth/AuthModule';
import { UsuarioModule } from './UsuarioModule';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Usuario } from './services/persistencia/entidades/Usuario.entity';
import { Alergias } from './services/persistencia/entidades/Alergias.entity';
import { Cirurgias } from './services/persistencia/entidades/Cirurgias.entity';
import { Doencas } from './services/persistencia/entidades/Doencas.entity';
import { Medicamentos } from './services/persistencia/entidades/Medicamentos.entity';
import { Medicos } from './services/persistencia/entidades/Medicos.entity';

import { UsuariosController } from './controllers/UsuariosController';
import { AlergiasController } from './controllers/AlergiasController';
import { CirurgiaController } from './controllers/CirurgiaController';
import { DoencasController } from './controllers/DoencasController';
import { MedicamentosController } from './controllers/MedicamentosController';
import { MedicosController } from './controllers/MedicosController';

import { UsuariosRepository } from './repositories/UsuariosRepository';
import { AlergiaRepository } from './repositories/AlergiaRepository';
import { CirurgiasRepository } from './repositories/CirurgiasRepository';
import { DoencasRepository } from './repositories/DoencasRepository';
import { MedicamentosRepository } from './repositories/MedicamentoRepository';
import { MedicosRepository } from './repositories/MedicosRepository';
import { ContatoEmergencia } from './services/persistencia/entidades/ContatoEmergencia.entity';
import { Exames } from './services/persistencia/entidades/ExamesRealizados.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql' as const,
                database: configService.getOrThrow<string>('DB_NAME'),
                host: configService.getOrThrow<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT', 3306),
                username: configService.getOrThrow<string>('DB_USER'),
                password: configService.getOrThrow<string>('DB_PASSWORD'),
                autoLoadEntities: true,
                synchronize: configService.get('NODE_ENV') !== 'production',
            }),
        }),
        UsuarioModule,
        AuthModule,
        TypeOrmModule.forFeature([
            Usuario,
            ContatoEmergencia,
            Alergias,
            Cirurgias,
            Doencas,
            Medicamentos,
            Medicos,
            Exames,
        ]),
    ],
    controllers: [
        AlergiasController,
        CirurgiaController,
        DoencasController,
        MedicamentosController,
        MedicosController,
    ],
    providers: [
        AlergiaRepository,
        CirurgiasRepository,
        DoencasRepository,
        MedicamentosRepository,
        MedicosRepository,
    ],
})

export class AppModule {}