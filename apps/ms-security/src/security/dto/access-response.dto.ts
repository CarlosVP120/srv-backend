export interface SucursalAccess {
  id: string;
  nombre: string;
  ciudad: string;
  status: string;
}

export interface EmpresaAccess {
  id: string;
  nombre: string;
  status: string;
  sucursal: SucursalAccess[];
}

export interface AccessResponseDto {
  empresas: EmpresaAccess[];
}
