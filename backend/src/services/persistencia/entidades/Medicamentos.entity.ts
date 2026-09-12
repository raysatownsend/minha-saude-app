import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Usuario } from './Usuario.entity';

@Entity('Medicamentos')
export class Medicamentos {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario;

    @RelationId((medicamento: Medicamentos) => medicamento.usuario)
    usuarioId: number;

    @Column({ type: 'varchar' })
    medicamento: string;

    @Column({ type: 'varchar' })
    dosagem: string;
}