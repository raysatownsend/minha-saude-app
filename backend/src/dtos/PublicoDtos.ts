import { IsNotEmpty, IsString } from 'class-validator';

export class VerificarSenhaPublicaDto {
    @IsString()
    @IsNotEmpty()
    senha: string;
}
