export interface Mantenimiento {
  idMantenimiento: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  costo: number;
  kilometraje: number;
  estado: boolean;
  idVehiculo: number;
}