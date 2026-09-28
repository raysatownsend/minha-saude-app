import { Body, Controller, HttpCode, HttpStatus, Param, Post, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { VerificarSenhaPublicaDto } from '../dtos/PublicoDtos';
import { PerfilPublico } from '../models/perfilPublico';
import { UsuariosRepository } from '../repositories/UsuariosRepository';
import { AlergiaRepository } from '../repositories/AlergiaRepository';
import { MedicamentosRepository } from '../repositories/MedicamentoRepository';
import { DoencasRepository } from '../repositories/DoencasRepository';
import { CirurgiasRepository } from '../repositories/CirurgiasRepository';
import { MedicosRepository } from '../repositories/MedicosRepository';

// Sem @UseGuards em lugar nenhum deste arquivo — de propósito. Quem
// acessa isso não tem conta nem login: é a pessoa que achou o crachá.
@Controller('publico')
export class PublicoController {
    constructor(
        private readonly usuariosRepository: UsuariosRepository,
        private readonly alergiaRepository: AlergiaRepository,
        private readonly medicamentosRepository: MedicamentosRepository,
        private readonly doencasRepository: DoencasRepository,
        private readonly cirurgiasRepository: CirurgiasRepository,
        private readonly medicosRepository: MedicosRepository,
    ) {}

    @Post(':codigo/verificar')
    @HttpCode(HttpStatus.OK)
    async verificar(
        @Param('codigo') codigo: string,
        @Body() dados: VerificarSenhaPublicaDto,
    ): Promise<PerfilPublico> {
        const usuario = await this.usuariosRepository.procurarUsuarioPorLinkPublico(codigo);

        // Mesma mensagem tanto pra "link não existe" quanto pra "existe
        // mas ainda não tem senha pública configurada" — não é o lugar
        // de revelar qual dos dois é o caso.
        if (!usuario || !usuario.senhaQrCode) {
            throw new UnauthorizedException('Link ou senha inválidos.');
        }

        const senhaConfere = await bcrypt.compare(dados.senha, usuario.senhaQrCode);
        if (!senhaConfere) {
            throw new UnauthorizedException('Link ou senha inválidos.');
        }

        const [alergias, medicamentos, doencas, cirurgias, medicos] = await Promise.all([
            this.alergiaRepository.listarTodasAlergias(usuario.id),
            this.medicamentosRepository.listarTodasMedicamentos(usuario.id),
            this.doencasRepository.listarTodasDoencas(usuario.id),
            this.cirurgiasRepository.listarTodasCirurgias(usuario.id),
            this.medicosRepository.listarTodosMedicos(usuario.id),
        ]);

        return {
            nome: usuario.nome,
            sobrenome: usuario.sobrenome,
            sexo: usuario.sexo,
            tipoSangue: usuario.tipoSangue,
            planoSaude: usuario.planoSaude,
            contatoEmergencia: {
                nome: usuario.contatoEmergencia.nome,
                telefone: usuario.contatoEmergencia.telefone,
            },
            alergias: alergias.map((a) => a.alergia),
            medicamentos: medicamentos.map((m) => ({ medicamento: m.medicamento, dosagem: m.dosagem })),
            doencas: doencas.map((d) => d.doenca),
            cirurgias: cirurgias.map((c) => ({ cirurgia: c.cirurgia, data: c.data })),
            medicos: medicos.map((m) => ({ nome: m.nome, telefone: m.telefone, especialidade: m.especialidade })),
        };
    }
}
