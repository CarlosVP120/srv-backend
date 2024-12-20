import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BufferToHexTransformer } from '../shared/transformers/buffer-to-hex.transformer';

@Entity('PRODUCTO')
export class Producto {
  @PrimaryColumn('uuid', {
    primary: true,
    transformer: new BufferToHexTransformer(),
  })
  ID: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  CLAVE: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  NOMBRE: string;

  @Column({
    type: 'clob',
    nullable: true,
  })
  DESCRIPCION: string;

  @Column({
    type: 'number',
    nullable: true,
    default: 0,
  })
  PRECIO: number;

  @Column({
    type: 'number',
    nullable: true,
    default: 0,
  })
  COSTO: number;

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  CLASIFICA_JSON: Record<string, any>;

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  OPERACION_JSON: Record<string, any>;

  @Column({
    type: 'json',
    nullable: true,
    default: '[]',
  })
  VARIANTES_JSON: any[];

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  RECETA_JSON: Record<string, any>;

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  TAXES_JSON: Record<string, any>;

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  LOGISTICA_JSON: Record<string, any>;

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  UNIDAD_JSON: Record<string, any>;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  MONEDA: string;

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  FEATURES_JSON: Record<string, any>;

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  PROVEE_JSON: Record<string, any>;

  @Column({
    type: 'json',
    nullable: true,
    default: '[]',
  })
  ARCHIVOS_JSON: any[];

  @Column({
    type: 'json',
    nullable: true,
    default: '[]',
  })
  IMAGENES_JSON: any[];

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  EXTRAS_JSON: Record<string, any>;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    default: 'ACTIVO',
  })
  STATUS: string;

  @Column('uuid', {
    nullable: false,
    transformer: new BufferToHexTransformer(),
  })
  SYSTEMUSERLINK: string;

  @Column({
    type: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  FECHA_UPDATE: Date;
}
