import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './Usuario.entity';

@Entity('ExamesRealizados')
export class Exames {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, { eager: true, nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario;

    @Column({ type: 'varchar' })
    linkPDF: string;
}
