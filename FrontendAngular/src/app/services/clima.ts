import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  map,
  Observable,
  switchMap,
  throwError
} from 'rxjs';


export interface ResultadoClima {

  ciudad: string;

  pais: string;

  temperatura: number;

  sensacion: number;

  humedad: number;

  precipitacion: number;

  viento: number;

  codigoClima: number;

  condicion: string;

  recomendacion: string;
}


interface RespuestaGeocoding {

  results?: Array<{

    name: string;

    latitude: number;

    longitude: number;

    country?: string;

  }>;
}


interface RespuestaClima {

  current: {

    temperature_2m: number;

    apparent_temperature: number;

    relative_humidity_2m: number;

    precipitation: number;

    weather_code: number;

    wind_speed_10m: number;

  };
}


@Injectable({
  providedIn: 'root'
})
export class ClimaService {

  private readonly urlGeocoding =
    'https://geocoding-api.open-meteo.com/v1/search';

  private readonly urlClima =
    'https://api.open-meteo.com/v1/forecast';


  constructor(
    private http: HttpClient
  ) { }


  consultarClima(
    ciudad: string
  ): Observable<ResultadoClima> {

    const parametrosGeocoding =
      new HttpParams()

        .set(
          'name',
          ciudad
        )

        .set(
          'count',
          '1'
        )

        .set(
          'language',
          'es'
        )

        .set(
          'format',
          'json'
        );


    return this.http
      .get<RespuestaGeocoding>(
        this.urlGeocoding,
        {
          params:
            parametrosGeocoding
        }
      )
      .pipe(

        switchMap(
          respuesta => {

            if (
              !respuesta.results ||
              respuesta.results.length === 0
            ) {

              return throwError(
                () =>
                  new Error(
                    'Ciudad no encontrada'
                  )
              );
            }


            const lugar =
              respuesta.results[0];


            const parametrosClima =
              new HttpParams()

                .set(
                  'latitude',
                  lugar.latitude.toString()
                )

                .set(
                  'longitude',
                  lugar.longitude.toString()
                )

                .set(
                  'current',
                  [
                    'temperature_2m',
                    'apparent_temperature',
                    'relative_humidity_2m',
                    'precipitation',
                    'weather_code',
                    'wind_speed_10m'
                  ].join(',')
                )

                .set(
                  'timezone',
                  'auto'
                );


            return this.http
              .get<RespuestaClima>(
                this.urlClima,
                {
                  params:
                    parametrosClima
                }
              )
              .pipe(

                map(
                  respuestaClima => {

                    const actual =
                      respuestaClima.current;


                    const resultado:
                      ResultadoClima = {

                      ciudad:
                        lugar.name,

                      pais:
                        lugar.country ?? '',

                      temperatura:
                        actual.temperature_2m,

                      sensacion:
                        actual.apparent_temperature,

                      humedad:
                        actual.relative_humidity_2m,

                      precipitacion:
                        actual.precipitation,

                      viento:
                        actual.wind_speed_10m,

                      codigoClima:
                        actual.weather_code,

                      condicion:
                        this.obtenerCondicion(
                          actual.weather_code
                        ),

                      recomendacion:
                        this.generarRecomendacion(
                          actual.temperature_2m,
                          actual.precipitation,
                          actual.wind_speed_10m,
                          actual.weather_code
                        )

                    };


                    return resultado;
                  }
                )

              );
          }
        )

      );
  }


  // =====================================================
  // DESCRIPCION DEL CLIMA
  // =====================================================

  private obtenerCondicion(
    codigo: number
  ): string {

    if (codigo === 0) {
      return 'Despejado';
    }

    if (
      codigo === 1 ||
      codigo === 2
    ) {
      return 'Parcialmente nublado';
    }

    if (codigo === 3) {
      return 'Nublado';
    }

    if (
      codigo === 45 ||
      codigo === 48
    ) {
      return 'Niebla';
    }

    if (
      codigo >= 51 &&
      codigo <= 57
    ) {
      return 'Llovizna';
    }

    if (
      codigo >= 61 &&
      codigo <= 67
    ) {
      return 'Lluvia';
    }

    if (
      codigo >= 71 &&
      codigo <= 77
    ) {
      return 'Nieve';
    }

    if (
      codigo >= 80 &&
      codigo <= 82
    ) {
      return 'Chubascos';
    }

    if (
      codigo >= 95
    ) {
      return 'Tormenta';
    }


    return 'Condición variable';
  }


  // =====================================================
  // RECOMENDACION PARA VEHICULO / MANTENIMIENTO
  // =====================================================

  private generarRecomendacion(
    temperatura: number,
    precipitacion: number,
    viento: number,
    codigo: number
  ): string {


    if (
      codigo >= 95
    ) {

      return (
        'Se recomienda evitar viajes innecesarios. ' +
        'Revise neumáticos, limpiaparabrisas y luces antes de conducir.'
      );
    }


    if (
      precipitacion > 0 ||
      (
        codigo >= 51 &&
        codigo <= 82
      )
    ) {

      return (
        'Hay presencia de lluvia. ' +
        'Revise limpiaparabrisas, frenos y estado de los neumáticos.'
      );
    }


    if (
      temperatura >= 32
    ) {

      return (
        'La temperatura es elevada. ' +
        'Se recomienda revisar refrigerante, nivel de aceite y sistema de enfriamiento.'
      );
    }


    if (
      temperatura <= 8
    ) {

      return (
        'La temperatura es baja. ' +
        'Compruebe batería, presión de neumáticos y nivel de líquidos.'
      );
    }


    if (
      viento >= 40
    ) {

      return (
        'Hay viento fuerte. ' +
        'Conduzca con precaución y revise la presión y estado de los neumáticos.'
      );
    }


    return (
      'Las condiciones climáticas son favorables. ' +
      'Mantenga el mantenimiento preventivo habitual del vehículo.'
    );
  }
}