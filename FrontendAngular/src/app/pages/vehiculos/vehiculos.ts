import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Soap } from '../../services/soap';
import { Vehiculo } from '../../models/vehiculo';
import { Categoria } from '../../models/categoria';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './vehiculos.html',
  styleUrl: './vehiculos.css'
})
export class Vehiculos implements OnInit {

  vehiculos: Vehiculo[] = [];
  categorias: Categoria[] = [];

  vehiculo: Vehiculo = {
    idVehiculo: 0,
    placa: '',
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    precio: 0,
    estado: true,
    idCategoria: 0
  };

  editando = false;
  cargando = false;

  mensaje = '';
  error = '';


  constructor(
    private soapService: Soap,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {

    this.cargarCategorias();
    this.cargarVehiculos();
  }


  // =====================================================
  // CATEGORIAS
  // =====================================================

  cargarCategorias(): void {

    this.soapService
      .obtenerCategorias()
      .subscribe({

        next: (datos: Categoria[]) => {

          this.categorias = datos;

          if (
            this.vehiculo.idCategoria === 0 &&
            datos.length > 0
          ) {
            this.vehiculo.idCategoria =
              datos[0].idCategoria;
          }

          this.cdr.detectChanges();
        },

        error: (err: unknown) => {

          console.error(err);

          this.error =
            'No se pudieron cargar las categorías.';

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // VEHICULOS
  // =====================================================

  cargarVehiculos(): void {

    this.cargando = true;
    this.error = '';

    this.soapService
      .obtenerVehiculos()
      .subscribe({

        next: (datos: Vehiculo[]) => {

          this.vehiculos = datos;
          this.cargando = false;

          this.cdr.detectChanges();
        },

        error: (err: unknown) => {

          console.error(err);

          this.error =
            'No se pudieron cargar los vehículos. Verifique que el SOAP esté ejecutándose.';

          this.cargando = false;

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


    if (!this.vehiculo.placa.trim()) {

      this.error =
        'La placa es obligatoria.';

      this.cdr.detectChanges();

      return;
    }


    if (!this.vehiculo.marca.trim()) {

      this.error =
        'La marca es obligatoria.';

      this.cdr.detectChanges();

      return;
    }


    if (!this.vehiculo.modelo.trim()) {

      this.error =
        'El modelo es obligatorio.';

      this.cdr.detectChanges();

      return;
    }


    if (this.vehiculo.idCategoria <= 0) {

      this.error =
        'Debe seleccionar una categoría.';

      this.cdr.detectChanges();

      return;
    }


    if (
      this.vehiculo.anio < 1900 ||
      this.vehiculo.anio > 2100
    ) {

      this.error =
        'Ingrese un año válido.';

      this.cdr.detectChanges();

      return;
    }


    if (this.vehiculo.precio < 0) {

      this.error =
        'El precio no puede ser negativo.';

      this.cdr.detectChanges();

      return;
    }


    // ===================================================
    // ACTUALIZAR
    // ===================================================

    if (this.editando) {

      this.soapService
        .actualizarVehiculo(
          this.vehiculo
        )
        .subscribe({

          next: () => {

            this.limpiarFormulario();

            this.mensaje =
              'Vehículo actualizado correctamente.';

            this.cdr.detectChanges();

            this.cargarVehiculos();
          },

          error: (err: unknown) => {

            console.error(err);

            this.error =
              'No se pudo actualizar el vehículo.';

            this.cdr.detectChanges();
          }

        });

    }

    // ===================================================
    // REGISTRAR
    // ===================================================

    else {

      this.soapService
        .agregarVehiculo(
          this.vehiculo
        )
        .subscribe({

          next: () => {

            this.limpiarFormulario();

            this.mensaje =
              'Vehículo registrado correctamente.';

            this.cdr.detectChanges();

            this.cargarVehiculos();
          },

          error: (err: unknown) => {

            console.error(err);

            this.error =
              'No se pudo registrar el vehículo.';

            this.cdr.detectChanges();
          }

        });

    }
  }


  // =====================================================
  // EDITAR
  // =====================================================

  editar(item: Vehiculo): void {

    this.vehiculo = {
      ...item
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

  eliminar(item: Vehiculo): void {

    const confirmar =
      window.confirm(
        `¿Desea eliminar el vehículo ${item.marca} ${item.modelo} - ${item.placa}?`
      );

    if (!confirmar) {
      return;
    }


    this.mensaje = '';
    this.error = '';


    this.soapService
      .eliminarVehiculo(
        item.idVehiculo
      )
      .subscribe({

        next: (eliminado: boolean) => {

          if (eliminado) {

            this.mensaje =
              'Vehículo eliminado correctamente.';

            this.cdr.detectChanges();

            this.cargarVehiculos();

          } else {

            this.error =
              'No se pudo eliminar el vehículo.';

            this.cdr.detectChanges();
          }

        },

        error: (err: unknown) => {

          console.error(err);

          this.error =
            'No se pudo eliminar el vehículo. Puede tener mantenimientos asociados.';

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // NOMBRE DE CATEGORIA
  // =====================================================

  obtenerNombreCategoria(
    idCategoria: number
  ): string {

    const categoria =
      this.categorias.find(
        c =>
          c.idCategoria === idCategoria
      );

    return categoria
      ? categoria.nombre
      : `Categoría ${idCategoria}`;
  }


  // =====================================================
  // LIMPIAR
  // =====================================================

  limpiarFormulario(): void {

    this.vehiculo = {

      idVehiculo: 0,

      placa: '',

      marca: '',

      modelo: '',

      anio:
        new Date().getFullYear(),

      precio: 0,

      estado: true,

      idCategoria:
        this.categorias.length > 0
          ? this.categorias[0].idCategoria
          : 0
    };

    this.editando = false;

    this.cdr.detectChanges();
  }


  cancelar(): void {

    this.limpiarFormulario();

    this.mensaje = '';
    this.error = '';
  }
}