import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Categoria } from '../models/categoria';
import { Vehiculo } from '../models/vehiculo';

@Injectable({
  providedIn: 'root'
})
export class Soap {

  private readonly url =
    'http://localhost:5284/VehiculoService.svc';

  constructor(private http: HttpClient) { }


  // =====================================================
  // HEADERS SOAP
  // =====================================================

  private crearHeaders(accion: string): HttpHeaders {

    return new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction':
        `"http://tempuri.org/IVehiculoService/${accion}"`,
      'Accept': 'text/xml'
    });
  }


  // =====================================================
  // ESCAPAR TEXTO XML
  // =====================================================

  private escaparXml(valor: string): string {

    return valor
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }


  // =====================================================
  // CATEGORIAS
  // =====================================================

  obtenerCategorias(): Observable<Categoria[]> {

    const xml =
`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/">

    <soap:Header/>

    <soap:Body>
        <tem:ObtenerCategorias/>
    </soap:Body>

</soap:Envelope>`;

    return this.http.post(
      this.url,
      xml,
      {
        headers: this.crearHeaders(
          'ObtenerCategorias'
        ),
        responseType: 'text'
      }
    ).pipe(
      map((respuesta: string) =>
        this.convertirCategorias(respuesta)
      )
    );
  }


  agregarCategoria(
    categoria: Categoria
  ): Observable<string> {

    const xml =
`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/"
    xmlns:cat="http://schemas.datacontract.org/2004/07/VehiculosSOAPDB.Models">

    <soap:Header/>

    <soap:Body>

        <tem:AgregarCategoria>

            <tem:categoria>

                <cat:Descripcion>${this.escaparXml(categoria.descripcion)}</cat:Descripcion>
                <cat:Estado>${categoria.estado}</cat:Estado>
                <cat:IdCategoria>0</cat:IdCategoria>
                <cat:Nombre>${this.escaparXml(categoria.nombre)}</cat:Nombre>

            </tem:categoria>

        </tem:AgregarCategoria>

    </soap:Body>

</soap:Envelope>`;

    return this.http.post(
      this.url,
      xml,
      {
        headers: this.crearHeaders(
          'AgregarCategoria'
        ),
        responseType: 'text'
      }
    );
  }


  actualizarCategoria(
    categoria: Categoria
  ): Observable<string> {

    const xml =
`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/"
    xmlns:cat="http://schemas.datacontract.org/2004/07/VehiculosSOAPDB.Models">

    <soap:Header/>

    <soap:Body>

        <tem:ActualizarCategoria>

            <tem:categoria>

                <cat:Descripcion>${this.escaparXml(categoria.descripcion)}</cat:Descripcion>
                <cat:Estado>${categoria.estado}</cat:Estado>
                <cat:IdCategoria>${categoria.idCategoria}</cat:IdCategoria>
                <cat:Nombre>${this.escaparXml(categoria.nombre)}</cat:Nombre>

            </tem:categoria>

        </tem:ActualizarCategoria>

    </soap:Body>

</soap:Envelope>`;

    return this.http.post(
      this.url,
      xml,
      {
        headers: this.crearHeaders(
          'ActualizarCategoria'
        ),
        responseType: 'text'
      }
    );
  }


  eliminarCategoria(
    id: number
  ): Observable<boolean> {

    const xml =
`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/">

    <soap:Header/>

    <soap:Body>

        <tem:EliminarCategoria>
            <tem:id>${id}</tem:id>
        </tem:EliminarCategoria>

    </soap:Body>

</soap:Envelope>`;

    return this.http.post(
      this.url,
      xml,
      {
        headers: this.crearHeaders(
          'EliminarCategoria'
        ),
        responseType: 'text'
      }
    ).pipe(

      map((respuesta: string) => {

        const documento =
          new DOMParser().parseFromString(
            respuesta,
            'text/xml'
          );

        const resultado =
          documento.getElementsByTagNameNS(
            '*',
            'EliminarCategoriaResult'
          )[0];

        return (
          resultado?.textContent?.toLowerCase() === 'true'
        );
      })

    );
  }


  // =====================================================
  // VEHICULOS - OBTENER TODOS
  // =====================================================

  obtenerVehiculos(): Observable<Vehiculo[]> {

    const xml =
`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/">

    <soap:Header/>

    <soap:Body>
        <tem:ObtenerVehiculos/>
    </soap:Body>

</soap:Envelope>`;

    return this.http.post(
      this.url,
      xml,
      {
        headers: this.crearHeaders(
          'ObtenerVehiculos'
        ),
        responseType: 'text'
      }
    ).pipe(
      map((respuesta: string) =>
        this.convertirVehiculos(respuesta)
      )
    );
  }


  // =====================================================
  // VEHICULOS - AGREGAR
  // =====================================================

  agregarVehiculo(
    vehiculo: Vehiculo
  ): Observable<string> {

    const xml =
`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/"
    xmlns:veh="http://schemas.datacontract.org/2004/07/VehiculosSOAPDB.Models">

    <soap:Header/>

    <soap:Body>

        <tem:AgregarVehiculo>

            <tem:vehiculo>

                <veh:Anio>${vehiculo.anio}</veh:Anio>
                <veh:Estado>${vehiculo.estado}</veh:Estado>
                <veh:IdCategoria>${vehiculo.idCategoria}</veh:IdCategoria>
                <veh:IdVehiculo>0</veh:IdVehiculo>
                <veh:Marca>${this.escaparXml(vehiculo.marca)}</veh:Marca>
                <veh:Modelo>${this.escaparXml(vehiculo.modelo)}</veh:Modelo>
                <veh:Placa>${this.escaparXml(vehiculo.placa)}</veh:Placa>
                <veh:Precio>${vehiculo.precio}</veh:Precio>

            </tem:vehiculo>

        </tem:AgregarVehiculo>

    </soap:Body>

</soap:Envelope>`;

    return this.http.post(
      this.url,
      xml,
      {
        headers: this.crearHeaders(
          'AgregarVehiculo'
        ),
        responseType: 'text'
      }
    );
  }


  // =====================================================
  // VEHICULOS - ACTUALIZAR
  // =====================================================

  actualizarVehiculo(
    vehiculo: Vehiculo
  ): Observable<string> {

    const xml =
`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/"
    xmlns:veh="http://schemas.datacontract.org/2004/07/VehiculosSOAPDB.Models">

    <soap:Header/>

    <soap:Body>

        <tem:ActualizarVehiculo>

            <tem:vehiculo>

                <veh:Anio>${vehiculo.anio}</veh:Anio>
                <veh:Estado>${vehiculo.estado}</veh:Estado>
                <veh:IdCategoria>${vehiculo.idCategoria}</veh:IdCategoria>
                <veh:IdVehiculo>${vehiculo.idVehiculo}</veh:IdVehiculo>
                <veh:Marca>${this.escaparXml(vehiculo.marca)}</veh:Marca>
                <veh:Modelo>${this.escaparXml(vehiculo.modelo)}</veh:Modelo>
                <veh:Placa>${this.escaparXml(vehiculo.placa)}</veh:Placa>
                <veh:Precio>${vehiculo.precio}</veh:Precio>

            </tem:vehiculo>

        </tem:ActualizarVehiculo>

    </soap:Body>

</soap:Envelope>`;

    return this.http.post(
      this.url,
      xml,
      {
        headers: this.crearHeaders(
          'ActualizarVehiculo'
        ),
        responseType: 'text'
      }
    );
  }


  // =====================================================
  // VEHICULOS - ELIMINAR
  // =====================================================

  eliminarVehiculo(
    id: number
  ): Observable<boolean> {

    const xml =
`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/">

    <soap:Header/>

    <soap:Body>

        <tem:EliminarVehiculo>
            <tem:id>${id}</tem:id>
        </tem:EliminarVehiculo>

    </soap:Body>

</soap:Envelope>`;

    return this.http.post(
      this.url,
      xml,
      {
        headers: this.crearHeaders(
          'EliminarVehiculo'
        ),
        responseType: 'text'
      }
    ).pipe(

      map((respuesta: string) => {

        const documento =
          new DOMParser().parseFromString(
            respuesta,
            'text/xml'
          );

        const resultado =
          documento.getElementsByTagNameNS(
            '*',
            'EliminarVehiculoResult'
          )[0];

        return (
          resultado?.textContent?.toLowerCase() === 'true'
        );
      })

    );
  }


  // =====================================================
  // CONVERTIR XML CATEGORIAS
  // =====================================================

  private convertirCategorias(
    xml: string
  ): Categoria[] {

    const documento =
      new DOMParser().parseFromString(
        xml,
        'text/xml'
      );

    const nodos =
      Array.from(
        documento.getElementsByTagNameNS(
          '*',
          'Categoria'
        )
      );

    return nodos.map(
      (nodo: Element) => {

        const obtenerValor =
          (nombre: string): string => {

            const elemento =
              nodo.getElementsByTagNameNS(
                '*',
                nombre
              )[0];

            return elemento?.textContent ?? '';
          };

        return {

          idCategoria:
            Number(
              obtenerValor('IdCategoria')
            ),

          nombre:
            obtenerValor('Nombre'),

          descripcion:
            obtenerValor('Descripcion'),

          estado:
            obtenerValor('Estado')
              .toLowerCase() === 'true'

        };
      }
    );
  }


  // =====================================================
  // CONVERTIR XML VEHICULOS
  // =====================================================

  private convertirVehiculos(
    xml: string
  ): Vehiculo[] {

    const documento =
      new DOMParser().parseFromString(
        xml,
        'text/xml'
      );

    const nodos =
      Array.from(
        documento.getElementsByTagNameNS(
          '*',
          'Vehiculo'
        )
      );

    return nodos.map(
      (nodo: Element) => {

        const obtenerValor =
          (nombre: string): string => {

            const elemento =
              nodo.getElementsByTagNameNS(
                '*',
                nombre
              )[0];

            return elemento?.textContent ?? '';
          };

        return {

          idVehiculo:
            Number(
              obtenerValor('IdVehiculo')
            ),

          placa:
            obtenerValor('Placa'),

          marca:
            obtenerValor('Marca'),

          modelo:
            obtenerValor('Modelo'),

          anio:
            Number(
              obtenerValor('Anio')
            ),

          precio:
            Number(
              obtenerValor('Precio')
            ),

          estado:
            obtenerValor('Estado')
              .toLowerCase() === 'true',

          idCategoria:
            Number(
              obtenerValor('IdCategoria')
            )

        };

      }
    );
  }
}