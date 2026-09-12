import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CriarAlergiaDto {
    @IsString()
    @IsNotEmpty()
    alergia: string;
}

export class AtualizarAlergiaDTO {
    @IsString()
    @IsNotEmpty()
    alergia: string;
}

export class CriarCirurgiaDto {
    @IsString()
    @IsNotEmpty()
    cirurgia: string;

    @IsOptional()
    @IsString()
    data?: string;
}

export class AtualizarCirurgiaDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    cirurgia?: string;

    @IsOptional()
    @IsString()
    data?: string;
}

export class CriarDoencaDto {
    @IsString()
    @IsNotEmpty()
    doenca: string;
}

export class AtualizarDoencaDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    doenca?: string;
}

export class CriarMedicamentoDto {
    @IsString()
    @IsNotEmpty()
    medicamento: string;

    @IsString()
    @IsNotEmpty()
    dosagem: string;
}

export class AtualizarMedicamentoDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    medicamento?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    dosagem?: string;
}

export class CriarMedicoDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    telefone: string;

    @IsString()
    @IsNotEmpty()
    especialidade: string;
}

export class AtualizarMedicoDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    nome?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    telefone?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    especialidade?: string;
}
