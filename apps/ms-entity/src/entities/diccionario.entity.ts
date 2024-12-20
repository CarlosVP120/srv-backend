import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BufferToHexTransformer } from '../shared/transformers/buffer-to-hex.transformer';

@Entity('DICCIONARIO')
export class Diccionario {
  @PrimaryColumn('uuid', {
    primary: true,
    transformer: new BufferToHexTransformer(),
  })
  ID: string;

  @Column('uuid', {
    nullable: true,
    transformer: new BufferToHexTransformer(),
  })
  DICCIONARIOLINK: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  MODULO: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  NOMBRE: string;

  @Column({
    type: 'number',
    precision: 1,
    scale: 0,
    default: 0,
    nullable: true,
  })
  ES_BASE: number;

  @Column({
    type: 'number',
    precision: 1,
    scale: 0,
    default: 0,
    nullable: true,
  })
  ES_PERSONALIZADO: number;

  @Column({
    type: 'clob',
    nullable: false,
  })
  DESCRIPCION: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  TIPODEFINICION: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  TIPOCONTENIDO: string;

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  CONTENIDO_JSON: Record<string, any>;

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  OPCIONES_JSON: Record<string, any>;

  @Column({
    type: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  FECHA_UPDATE: Date;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: 'ACTIVO',
  })
  STATUS: string;
}
