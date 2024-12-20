import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BufferToHexTransformer } from '../shared/transformers/buffer-to-hex.transformer';

@Entity('ITEM')
export class Item {
  @PrimaryColumn('uuid', {
    primary: true,
    transformer: new BufferToHexTransformer(),
  })
  ID: string;

  @Column('uuid', {
    nullable: false,
    transformer: new BufferToHexTransformer(),
  })
  PRODUCTOLINK: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  CLAVE: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  SKU: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    default: 'PZ',
  })
  UNIDAD: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  DESCRIPCION: string;

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  VARIANTE_JSON: Record<string, any>;

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
    type: 'json',
    nullable: true,
    default: '[]',
  })
  SKUS_JSON: any[];

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  PROVEE_JSON: Record<string, any>;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
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

  @Column({
    type: 'number',
    nullable: true,
    default: 0,
  })
  PRECIO: number;
}
