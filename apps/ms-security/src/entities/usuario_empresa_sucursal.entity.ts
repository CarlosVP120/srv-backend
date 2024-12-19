import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BufferToHexTransformer } from '../shared/transformers/buffer-to-hex.transformer';

@Entity('USUARIO_EMPRESA_SUCURSAL')
export class UsuarioEmpresaSucursal {
  @Column({
    type: 'date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  FECHA_UPDATE: Date;

  @PrimaryColumn('uuid', {
    transformer: new BufferToHexTransformer(),
  })
  USUARIOLINK: string;

  @PrimaryColumn('uuid', {
    transformer: new BufferToHexTransformer(),
  })
  EMPRESALINK: string;

  @PrimaryColumn('uuid', {
    transformer: new BufferToHexTransformer(),
  })
  SUCURSALLINK: string;
}
