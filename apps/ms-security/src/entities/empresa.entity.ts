import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BufferToHexTransformer } from '../shared/transformers/buffer-to-hex.transformer';

@Entity('EMPRESA')
export class Empresa {
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
  RAZON_SOCIAL: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  RFC: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  DBUSER: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  DBPASS: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  SERVIDOR: string;

  @Column({
    type: 'number',
    precision: 38,
    scale: 0,
    nullable: false,
  })
  PUERTO: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  SERVICE_NAME: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  PDB: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: 'ACTIVO',
  })
  STATUS: string;
}
