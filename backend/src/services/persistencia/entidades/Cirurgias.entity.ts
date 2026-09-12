import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Usuario } from './Usuario.entity';

@Entity('Cirurgias')
export class Cirurgias {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario;

    @RelationId((cirurgia: Cirurgias) => cirurgia.usuario)
    usuarioId: number;

    @Column({ type: 'varchar' })
    cirurgia: string;

    @Column({ type: 'varchar', nullable: true })
    data?: string;
}