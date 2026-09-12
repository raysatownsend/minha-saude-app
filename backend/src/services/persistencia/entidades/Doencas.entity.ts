import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Usuario } from './Usuario.entity';

@Entity('Doenças')
export class Doencas {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario;

    @RelationId((doenca: Doencas) => doenca.usuario)
    usuarioId: number;

    @Column({ type: 'varchar' })
    doenca: string;
}