import { Type } from 'class-transformer';
import {
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { TIPOS_SANGUE_VALIDOS, TiposSangue } from '../models/TiposSangue';

export class ContatoEmergenciaDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    telefone: string;
}

export class CriarUsuarioDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    sobrenome: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsString()
    senhaQrCode?: string;

    @IsIn(['Masculino', 'Feminino', 'Outro'])
    sexo: 'Masculino' | 'Feminino' | 'Outro';

    @IsString()
    @IsNotEmpty()
    enderecoCompleto: string;

    @IsString()
    @IsNotEmpty()
    planoSaude: string;

    @ValidateNested()
    @Type(() => ContatoEmergenciaDto)
    contatoEmergencia: ContatoEmergenciaDto;

    @IsIn(TIPOS_SANGUE_VALIDOS)
    tipoSangue: TiposSangue;
}

export class AtualizarUsuarioDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    nome?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    sobrenome?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    username?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    senhaApp?: string;

    @IsOptional()
    @IsString()
    senhaQrCode?: string;

    @IsOptional()
    @IsIn(['Masculino', 'Feminino', 'Outro'])
    sexo?: 'Masculino' | 'Feminino' | 'Outro';

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    enderecoCompleto?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    planoSaude?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => ContatoEmergenciaDto)
    contatoEmergencia?: ContatoEmergenciaDto;

    @IsOptional()
    @IsIn(TIPOS_SANGUE_VALIDOS)
    tipoSangue?: TiposSangue;
}
