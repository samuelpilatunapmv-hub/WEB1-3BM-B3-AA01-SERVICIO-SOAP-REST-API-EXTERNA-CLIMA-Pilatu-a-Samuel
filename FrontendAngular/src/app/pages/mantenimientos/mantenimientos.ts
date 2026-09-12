import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Mantenimiento
} from '../../models/mantenimiento';

import {
  Vehiculo
} from '../../models/vehiculo';

import {
  MantenimientoService
} from '../../services/mantenimiento';

import {
  Soap
} from '../../services/soap';


@Component({
  selector: 'app-mantenimientos',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './mantenimientos.html',
  styleUrl: './mantenimientos.css'
})
export class Mantenimientos implements OnInit {

  mantenimientos: Mantenimiento[] = [];

  vehiculos: Vehiculo[] = [];


  mantenimiento: Mantenimiento = {

    idMantenimiento: 0,

    fecha:
      this.fechaActual(),

    tipo: '',

    descripcion: '',

    costo: 0,

    kilometraje: 0,

    estado: true,

    idVehiculo: 0
  };


  editando = false;

  cargando = false;

  mensaje = '';

  error = '';


  constructor(

    private mantenimientoService:
      MantenimientoService,

    private soapService:
      Soap,

    private cdr:
      ChangeDetectorRef

  ) { }


  ngOnInit(): void {

    this.cargarVehiculos();

    this.cargarMantenimientos();
  }


  // =====================================================
  // CARGAR VEHICULOS DESDE SOAP
  // =====================================================

  cargarVehiculos(): void {

    this.soapService
      .obtenerVehiculos()
      .subscribe({

        next: (
          datos: Vehiculo[]
        ) => {

          this.vehiculos = datos;


          if (
            this.mantenimiento.idVehiculo === 0 &&
            datos.length > 0
          ) {

            this.mantenimiento.idVehiculo =
              datos[0].idVehiculo;
          }


          this.cdr.detectChanges();
        },


        error: (
          err: unknown
        ) => {

          console.error(err);

          this.error =
            'No se pudieron cargar los vehículos. Verifique que el servicio SOAP esté ejecutándose.';

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // CARGAR MANTENIMIENTOS DESDE REST
  // =====================================================

  cargarMantenimientos(): void {

    this.cargando = true;

    this.error = '';


    this.mantenimientoService
      .obtenerMantenimientos()
      .subscribe({

        next: (
          datos: Mantenimiento[]
        ) => {

          this.mantenimientos =
            datos;

          this.cargando =
            false;

          this.cdr.detectChanges();
        },


        error: (
          err: unknown
        ) => {

          console.error(err);

          this.error =
            'No se pudieron cargar los mantenimientos. Verifique que el servicio REST esté ejecutándose.';

          this.cargando =
            false;

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // GUARDAR
  // =====================================================

  guardar(): void {

    this.mensaje = '';

    this.error = '';


    // VEHICULO

    if (
      this.mantenimiento.idVehiculo <= 0
    ) {

      this.error =
        'Debe seleccionar un vehículo.';

      this.cdr.detectChanges();

      return;
    }


    // FECHA

    if (
      !this.mantenimiento.fecha
    ) {

      this.error =
        'La fecha es obligatoria.';

      this.cdr.detectChanges();

      return;
    }


    // TIPO

    if (
      !this.mantenimiento.tipo.trim()
    ) {

      this.error =
        'El tipo de mantenimiento es obligatorio.';

      this.cdr.detectChanges();

      return;
    }


    // COSTO

    if (
      this.mantenimiento.costo < 0
    ) {

      this.error =
        'El costo no puede ser negativo.';

      this.cdr.detectChanges();

      return;
    }


    // KILOMETRAJE

    if (
      this.mantenimiento.kilometraje < 0
    ) {

      this.error =
        'El kilometraje no puede ser negativo.';

      this.cdr.detectChanges();

      return;
    }


    // ===================================================
    // ACTUALIZAR
    // ===================================================

    if (
      this.editando
    ) {

      this.mantenimientoService
        .actualizarMantenimiento(
          this.mantenimiento
        )
        .subscribe({

          next: () => {

            this.limpiarFormulario();

            this.mensaje =
              'Mantenimiento actualizado correctamente.';

            this.cdr.detectChanges();

            this.cargarMantenimientos();
          },


          error: (
            err: unknown
          ) => {

            console.error(err);

            this.error =
              'No se pudo actualizar el mantenimiento.';

            this.cdr.detectChanges();
          }

        });

    }


    // ===================================================
    // REGISTRAR
    // ===================================================

    else {

      this.mantenimientoService
        .agregarMantenimiento(
          this.mantenimiento
        )
        .subscribe({

          next: () => {

            this.limpiarFormulario();

            this.mensaje =
              'Mantenimiento registrado correctamente.';

            this.cdr.detectChanges();

            this.cargarMantenimientos();
          },


          error: (
            err: unknown
          ) => {

            console.error(err);

            this.error =
              'No se pudo registrar el mantenimiento.';

            this.cdr.detectChanges();
          }

        });

    }
  }


  // =====================================================
  // EDITAR
  // =====================================================

  editar(
    item: Mantenimiento
  ): void {

    this.mantenimiento = {

      ...item,

      fecha:
        item.fecha
          ? item.fecha.substring(
              0,
              10
            )
          : this.fechaActual()
    };


    this.editando = true;

    this.mensaje = '';

    this.error = '';


    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });


    this.cdr.detectChanges();
  }


  // =====================================================
  // ELIMINAR
  // =====================================================

  eliminar(
    item: Mantenimiento
  ): void {

    const confirmar =
      window.confirm(
        `¿Desea eliminar el mantenimiento "${item.tipo}"?`
      );


    if (
      !confirmar
    ) {

      return;
    }


    this.mensaje = '';

    this.error = '';


    this.mantenimientoService
      .eliminarMantenimiento(
        item.idMantenimiento
      )
      .subscribe({

        next: () => {

          this.mensaje =
            'Mantenimiento eliminado correctamente.';

          this.cdr.detectChanges();

          this.cargarMantenimientos();
        },


        error: (
          err: unknown
        ) => {

          console.error(err);

          this.error =
            'No se pudo eliminar el mantenimiento.';

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // OBTENER NOMBRE VEHICULO
  // =====================================================

  obtenerNombreVehiculo(
    idVehiculo: number
  ): string {

    const vehiculo =
      this.vehiculos.find(

        item =>
          item.idVehiculo ===
          idVehiculo

      );


    if (
      !vehiculo
    ) {

      return (
        `Vehículo ${idVehiculo}`
      );
    }


    return (

      `${vehiculo.marca} ` +

      `${vehiculo.modelo} ` +

      `(${vehiculo.placa})`

    );
  }


  // =====================================================
  // LIMPIAR FORMULARIO
  // =====================================================

  limpiarFormulario(): void {

    this.mantenimiento = {

      idMantenimiento: 0,

      fecha:
        this.fechaActual(),

      tipo: '',

      descripcion: '',

      costo: 0,

      kilometraje: 0,

      estado: true,

      idVehiculo:
        this.vehiculos.length > 0
          ? this.vehiculos[0].idVehiculo
          : 0
    };


    this.editando = false;


    this.cdr.detectChanges();
  }


  // =====================================================
  // CANCELAR
  // =====================================================

  cancelar(): void {

    this.limpiarFormulario();

    this.mensaje = '';

    this.error = '';

    this.cdr.detectChanges();
  }


  // =====================================================
  // FECHA ACTUAL
  // =====================================================

  private fechaActual(): string {

    const fecha =
      new Date();


    const anio =
      fecha.getFullYear();


    const mes =
      String(
        fecha.getMonth() + 1
      )
      .padStart(
        2,
        '0'
      );


    const dia =
      String(
        fecha.getDate()
      )
      .padStart(
        2,
        '0'
      );


    return (
      `${anio}-${mes}-${dia}`
    );
  }
}