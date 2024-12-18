import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DICCIONARIO')
export class Diccionario {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'DICCIONARIOLINK', type: 'raw', nullable: true })
  diccionarioLink: string;

  @Column({ name: 'MODULO', type: 'varchar2', length: 50 })
  modulo: string;

  @Column({ name: 'NOMBRE', type: 'varchar2', length: 200 })
  nombre: string;

  @Column({
    name: 'ES_BASE',
    type: 'number',
    precision: 1,
    scale: 0,
    default: 0,
    nullable: true,
  })
  esBase: number;

  @Column({
    name: 'ES_PERSONALIZADO',
    type: 'number',
    precision: 1,
    scale: 0,
    default: 0,
    nullable: true,
  })
  esPersonalizado: number;

  @Column({ name: 'DESCRIPCION', type: 'clob' })
  descripcion: string;

  @Column({ name: 'TIPODEFINICION', type: 'varchar2', length: 50 })
  tipoDefinicion: string;

  @Column({ name: 'TIPOCONTENIDO', type: 'varchar2', length: 50 })
  tipoContenido: string;

  @Column({
    name: 'CONTENIDO_JSON',
    type: 'json',
    default: '{}',
    nullable: true,
  })
  contenidoJson: any;

  @Column({
    name: 'OPCIONES_JSON',
    type: 'json',
    default: '{}',
    nullable: true,
  })
  opcionesJson: any;

  @Column({
    name: 'FECHA_UPDATE',
    type: 'date',
    default: () => 'SYSDATE',
    nullable: true,
  })
  fechaUpdate: Date;

  @Column({
    name: 'STATUS',
    type: 'varchar2',
    length: 20,
    default: 'ACTIVO',
    nullable: true,
  })
  status: string;
}
