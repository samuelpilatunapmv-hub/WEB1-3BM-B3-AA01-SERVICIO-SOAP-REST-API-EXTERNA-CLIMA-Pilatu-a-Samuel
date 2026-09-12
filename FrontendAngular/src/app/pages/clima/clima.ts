import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  ClimaService,
  ResultadoClima
} from '../../services/clima';


@Component({
  selector: 'app-clima',

  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl:
    './clima.html',

  styleUrl:
    './clima.css'
})
export class Clima {

  ciudad =
    'Guayaquil';


  resultado:
    ResultadoClima | null =
      null;


  cargando =
    false;


  mensajeError =
    '';


  constructor(

    private climaService:
      ClimaService,

    private cdr:
      ChangeDetectorRef

  ) { }


  consultar(): void {

    this.mensajeError =
      '';

    this.resultado =
      null;


    if (
      !this.ciudad.trim()
    ) {

      this.mensajeError =
        'Ingrese una ciudad.';

      this.cdr.detectChanges();

      return;
    }


    this.cargando =
      true;


    this.climaService
      .consultarClima(
        this.ciudad.trim()
      )
      .subscribe({

        next: (
          datos: ResultadoClima
        ) => {

          this.resultado =
            datos;

          this.cargando =
            false;

          this.cdr.detectChanges();
        },


        error: (
          err: unknown
        ) => {

          console.error(
            err
          );


          this.resultado =
            null;

          this.cargando =
            false;


          this.mensajeError =
            'No se pudo encontrar la ciudad o consultar el clima. Intente nuevamente.';


          this.cdr.detectChanges();
        }

      });
  }


  obtenerIcono(): string {

    if (
      !this.resultado
    ) {

      return '🌤️';
    }


    const codigo =
      this.resultado.codigoClima;


    if (
      codigo === 0
    ) {

      return '☀️';
    }


    if (
      codigo >= 1 &&
      codigo <= 3
    ) {

      return '⛅';
    }


    if (
      codigo === 45 ||
      codigo === 48
    ) {

      return '🌫️';
    }


    if (
      codigo >= 51 &&
      codigo <= 82
    ) {

      return '🌧️';
    }


    if (
      codigo >= 95
    ) {

      return '⛈️';
    }


    return '🌤️';
  }
}