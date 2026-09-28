import { Type } from 'class-transformer';
import {
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    MinLength,
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
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    password: string;

    @IsIn(['Masculino', 'Feminino', 'Outro'])
    sexo: 'Masculino' | 'Feminino' | 'Outro';

    @IsString()
    @IsNotEmpty()
    enderecoCompleto: string;

    @IsOptional()
    @IsString()
    planoSaude?: string;

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

// Fica separado do AtualizarUsuarioDto de propósito: misturar "trocar
// endereço" com "definir a senha que libera meus dados de saúde pra
// qualquer um com o link" no mesmo endpoint tornaria fácil demais mudar
// essa senha sem querer. Por isso exige a senha de login pra confirmar.
export class DefinirSenhaPublicaDto {
    // Exatamente 5 — não "no mínimo": o código é gerado pelo app (tela
    // Senhas) e digitado em 5 caixinhas na página pública (PinInput).
    // Aceitar outros tamanhos aqui quebraria essa tela sem avisar.
    @IsString()
    @Length(5, 5, { message: 'A senha pública deve ter exatamente 5 caracteres.' })
    senhaPublica: string;

    @IsString()
    @IsNotEmpty()
    senhaLogin: string;
}

// Trocar a senha de login também merece endpoint próprio, pelo mesmo
// motivo do DefinirSenhaPublicaDto: exige a senha atual, então não
// cabe no PUT /me genérico (Cenário 6 da story de recuperar senha —
// sessão autenticada sozinha não deveria bastar pra essa troca).
export class AlterarSenhaDto {
    @IsString()
    @IsNotEmpty()
    senhaAtual: string;

    @IsString()
    @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres.' })
    novaSenha: string;
}
