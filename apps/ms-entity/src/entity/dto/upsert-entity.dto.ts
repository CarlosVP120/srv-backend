import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpsertEntityDto {
  @IsString()
  @IsNotEmpty()
  entidad: string;

  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  empresalink: string;

  @IsString()
  @IsNotEmpty()
  sucursallink: string;
}
