import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Usuario } from './Usuario.entity';

@Entity('Alergias')
export class Alergias {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario;

    @RelationId((alergia: Alergias) => alergia.usuario)
    usuarioId: number;

    @Column({ type: 'varchar' })
    alergia: string;
}
