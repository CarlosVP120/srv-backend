import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BufferToHexTransformer } from '../shared/transformers/buffer-to-hex.transformer';

@Entity('SUCURSAL')
export class Sucursal {
  @PrimaryColumn('uuid', {
    primary: true,
    transformer: new BufferToHexTransformer(),
  })
  ID: string;

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
  EMPRESALINK: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  NOMBRE: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  PAIS: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  ESTADO: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  CIUDAD: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  CP: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  DOMICILIO: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: 'ACTIVO',
  })
  STATUS: string;
}
