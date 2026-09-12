import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Categoria } from '../../models/categoria';
import { Soap } from '../../services/soap';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias implements OnInit {

  categorias: Categoria[] = [];

  categoria: Categoria = {
    idCategoria: 0,
    nombre: '',
    descripcion: '',
    estado: true
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
  }


  // =====================================================
  // CARGAR CATEGORIAS
  // =====================================================

  cargarCategorias(): void {

    this.cargando = true;
    this.error = '';

    this.soapService
      .obtenerCategorias()
      .subscribe({

        next: (datos: Categoria[]) => {

          this.categorias = datos;
          this.cargando = false;

          this.cdr.detectChanges();
        },

        error: (err: unknown) => {

          console.error(err);

          this.error =
            'No se pudieron cargar las categorías. Verifique que el servicio SOAP esté ejecutándose.';

          this.cargando = false;

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // GUARDAR / ACTUALIZAR
  // =====================================================

  guardar(): void {

    this.mensaje = '';
    this.error = '';

    if (!this.categoria.nombre.trim()) {

      this.error =
        'El nombre de la categoría es obligatorio.';

      this.cdr.detectChanges();

      return;
    }


    // ===================================================
    // ACTUALIZAR
    // ===================================================

    if (this.editando) {

      this.soapService
        .actualizarCategoria(this.categoria)
        .subscribe({

          next: () => {

            this.cancelar();

            this.mensaje =
              'Categoría actualizada correctamente.';

            this.cdr.detectChanges();

            this.cargarCategorias();
          },

          error: (err: unknown) => {

            console.error(err);

            this.error =
              'No se pudo actualizar la categoría.';

            this.cdr.detectChanges();
          }

        });

    }

    // ===================================================
    // REGISTRAR
    // ===================================================

    else {

      this.soapService
        .agregarCategoria(this.categoria)
        .subscribe({

          next: () => {

            this.cancelar();

            this.mensaje =
              'Categoría registrada correctamente.';

            this.cdr.detectChanges();

            this.cargarCategorias();
          },

          error: (err: unknown) => {

            console.error(err);

            this.error =
              'No se pudo registrar la categoría.';

            this.cdr.detectChanges();
          }

        });

    }
  }


  // =====================================================
  // EDITAR
  // =====================================================

  editar(item: Categoria): void {

    this.categoria = {
      ...item
    };

    this.editando = true;

    this.mensaje = '';
    this.error = '';

    this.cdr.detectChanges();
  }


  // =====================================================
  // ELIMINAR
  // =====================================================

  eliminar(item: Categoria): void {

    const confirmar =
      window.confirm(
        `¿Desea eliminar la categoría "${item.nombre}"?`
      );

    if (!confirmar) {
      return;
    }


    this.mensaje = '';
    this.error = '';


    this.soapService
      .eliminarCategoria(item.idCategoria)
      .subscribe({

        next: (eliminado: boolean) => {

          if (eliminado) {

            this.mensaje =
              'Categoría eliminada correctamente.';

            this.cdr.detectChanges();

            this.cargarCategorias();

          } else {

            this.error =
              'No se puede eliminar la categoría porque tiene vehículos asociados o ya no existe.';

            this.cdr.detectChanges();
          }

        },

        error: (err: unknown) => {

          console.error(err);

          this.error =
            'Ocurrió un error al eliminar la categoría.';

          this.cdr.detectChanges();
        }

      });
  }


  // =====================================================
  // CANCELAR EDICION / LIMPIAR FORMULARIO
  // =====================================================

  cancelar(): void {

    this.categoria = {
      idCategoria: 0,
      nombre: '',
      descripcion: '',
      estado: true
    };

    this.editando = false;

    this.cdr.detectChanges();
  }
}