import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('USUARIO')
export class User {
  @PrimaryGeneratedColumn('uuid')
  ID: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  NOMBRE: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  EMAIL: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  PASS: string;

  @Column({
    type: 'blob',
    nullable: true,
  })
  IMG: Buffer;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  TELEFONO: string;

  @Column({
    type: 'decimal',
    precision: 1,
    scale: 0,
    nullable: true,
    default: 0,
  })
  ISSUPERVISOR: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: 'ACTIVO',
  })
  STATUS: string;

  @Column({
    type: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  FECHA_UPDATE: Date;
}
