import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './Usuario.entity';

@Entity('ContatosEmergencia')
export class ContatoEmergencia {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    nome: string;

    @Column({ type: 'varchar' })
    telefone: string;

    @OneToOne(() => Usuario, (usuario) => usuario.contatoEmergencia)
    usuario: Usuario;
}
