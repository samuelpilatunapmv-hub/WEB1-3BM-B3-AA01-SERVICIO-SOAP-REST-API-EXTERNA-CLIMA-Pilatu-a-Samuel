import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Mantenimiento } from '../models/mantenimiento';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {

  private readonly url =
    'http://localhost:5234/api/mantenimiento';

  constructor(
    private http: HttpClient
  ) { }


  obtenerMantenimientos():
    Observable<Mantenimiento[]> {

    return this.http.get<Mantenimiento[]>(
      this.url
    );
  }


  obtenerMantenimiento(
    id: number
  ): Observable<Mantenimiento> {

    return this.http.get<Mantenimiento>(
      `${this.url}/${id}`
    );
  }


  obtenerPorVehiculo(
    idVehiculo: number
  ): Observable<Mantenimiento[]> {

    return this.http.get<Mantenimiento[]>(
      `${this.url}/vehiculo/${idVehiculo}`
    );
  }


  agregarMantenimiento(
    mantenimiento: Mantenimiento
  ): Observable<Mantenimiento> {

    const body = {
      idMantenimiento: 0,
      fecha: mantenimiento.fecha,
      tipo: mantenimiento.tipo,
      descripcion: mantenimiento.descripcion,
      costo: mantenimiento.costo,
      kilometraje: mantenimiento.kilometraje,
      estado: mantenimiento.estado,
      idVehiculo: mantenimiento.idVehiculo
    };

    return this.http.post<Mantenimiento>(
      this.url,
      body
    );
  }


  actualizarMantenimiento(
    mantenimiento: Mantenimiento
  ): Observable<Mantenimiento> {

    const body = {
      idMantenimiento:
        mantenimiento.idMantenimiento,

      fecha:
        mantenimiento.fecha,

      tipo:
        mantenimiento.tipo,

      descripcion:
        mantenimiento.descripcion,

      costo:
        mantenimiento.costo,

      kilometraje:
        mantenimiento.kilometraje,

      estado:
        mantenimiento.estado,

      idVehiculo:
        mantenimiento.idVehiculo
    };

    return this.http.put<Mantenimiento>(
      `${this.url}/${mantenimiento.idMantenimiento}`,
      body
    );
  }


  eliminarMantenimiento(
    id: number
  ): Observable<unknown> {

    return this.http.delete(
      `${this.url}/${id}`
    );
  }
}