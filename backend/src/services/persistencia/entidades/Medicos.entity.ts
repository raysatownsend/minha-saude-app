import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Usuario } from './Usuario.entity';

@Entity('Medicos')
export class Medicos {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario;

    @RelationId((medico: Medicos) => medico.usuario)
    usuarioId: number;

    @Column({ type: 'varchar' })
    nome: string;

    @Column({ type: 'varchar' })
    telefone: string;

    @Column({ type: 'varchar' })
    especialidade: string;
}