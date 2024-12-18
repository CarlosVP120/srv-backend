import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type as TransformType } from 'class-transformer';

export class FilterParams {
  [key: string]: any;
}

export class EntityParams {
  @IsString()
  @IsOptional()
  order?: string;

  @IsObject()
  @IsOptional()
  filter?: FilterParams;

  @IsNumber()
  @IsOptional()
  pagesize?: number;

  @IsNumber()
  @IsOptional()
  page?: number;
}

export class GetEntityDto {
  @IsString()
  @IsNotEmpty()
  entidad: string;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @TransformType(() => EntityParams)
  params: EntityParams;

  @IsString()
  @IsNotEmpty()
  empresalink: string;

  @IsString()
  @IsNotEmpty()
  sucursallink: string;
}
