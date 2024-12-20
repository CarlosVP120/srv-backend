import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BufferToHexTransformer } from '../shared/transformers/buffer-to-hex.transformer';

@Entity('PRODUCTO_CLASIFICA')
export class ProductoClasifica {
  @PrimaryColumn('uuid', {
    primary: true,
    transformer: new BufferToHexTransformer(),
  })
  ID: string;

  @Column('uuid', {
    nullable: true,
    transformer: new BufferToHexTransformer(),
  })
  PRODUCTO_CLASIFICALINK: string;

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
    type: 'varchar',
    length: 4000,
    nullable: false,
  })
  DESCRIPCION: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    default: 'ACTIVO',
  })
  STATUS: string;

  @Column({
    type: 'number',
    nullable: true,
    default: 0,
  })
  PESO: number;

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  IMAGEN_JSON: Record<string, any>;

  @Column({
    type: 'json',
    nullable: true,
    default: '{}',
  })
  EXTRAS_JSON: Record<string, any>;

  @Column({
    type: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  FECHA_UPDATE: Date;

  @Column('uuid', {
    nullable: false,
    transformer: new BufferToHexTransformer(),
  })
  SYSTEMUSERLINK: string;
}
