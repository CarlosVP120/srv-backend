import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DICCIONARIO')
export class Diccionario {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  ID: string;

  @Column({ name: 'DICCIONARIOLINK', type: 'raw', nullable: true })
  DICCIONARIOLINK: string;

  @Column({ name: 'MODULO', type: 'varchar2', length: 50 })
  MODULO: string;

  @Column({ name: 'NOMBRE', type: 'varchar2', length: 200 })
  NOMBRE: string;

  @Column({
    name: 'ES_BASE',
    type: 'number',
    precision: 1,
    scale: 0,
    default: 0,
    nullable: true,
  })
  ES_BASE: number;

  @Column({
    name: 'ES_PERSONALIZADO',
    type: 'number',
    precision: 1,
    scale: 0,
    default: 0,
    nullable: true,
  })
  ES_PERSONALIZADO: number;

  @Column({ name: 'DESCRIPCION', type: 'clob' })
  DESCRIPCION: string;

  @Column({ name: 'TIPODEFINICION', type: 'varchar2', length: 50 })
  TIPODEFINICION: string;

  @Column({ name: 'TIPOCONTENIDO', type: 'varchar2', length: 50 })
  TIPOCONTENIDO: string;

  @Column({
    name: 'CONTENIDO_JSON',
    type: 'json',
    default: '{}',
    nullable: true,
  })
  CONTENIDO_JSON: any;

  @Column({
    name: 'OPCIONES_JSON',
    type: 'json',
    default: '{}',
    nullable: true,
  })
  OPCIONES_JSON: any;

  @Column({
    name: 'FECHA_UPDATE',
    type: 'date',
    default: () => 'SYSDATE',
    nullable: true,
  })
  FECHA_UPDATE: Date;

  @Column({
    name: 'STATUS',
    type: 'varchar2',
    length: 20,
    default: 'ACTIVO',
    nullable: true,
  })
  STATUS: string;
}
