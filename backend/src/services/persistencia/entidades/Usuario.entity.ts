import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TiposSangue } from '../../../models/TiposSangue';
import { ContatoEmergencia } from './ContatoEmergencia.entity';

@Entity('Usuario')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    nome: string;
    
    @Column({ type: 'varchar' })
    sobrenome: string;

    @Column({ type: 'varchar', unique: true })
    username: string;

    @Column({ name: 'password', type: 'varchar' })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    senhaQrCode: string;

    @Column({ type: 'varchar' })
    sexo: 'Masculino' | 'Feminino' | 'Outro';

    @Column({ type: 'varchar' })
    enderecoCompleto: string;

    @Column({ type: 'varchar' })
    planoSaude: string;

    @OneToOne(() => ContatoEmergencia, (contatoEmergencia) => contatoEmergencia.usuario, {
        eager: true,
        cascade: true,
        nullable: false,
    })
    @JoinColumn({ name: 'contatoEmergenciaId' })
    contatoEmergencia: ContatoEmergencia;

    @Column({ type: 'varchar' })
    tipoSangue: TiposSangue;


}