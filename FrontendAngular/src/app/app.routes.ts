import { Routes } from '@angular/router';

import { Inicio } from './pages/inicio/inicio';
import { Categorias } from './pages/categorias/categorias';
import { Vehiculos } from './pages/vehiculos/vehiculos';
import { Mantenimientos } from './pages/mantenimientos/mantenimientos';
import { Clima } from './pages/clima/clima';

export const routes: Routes = [
  {
    path: '',
    component: Inicio
  },
  {
    path: 'categorias',
    component: Categorias
  },
  {
    path: 'vehiculos',
    component: Vehiculos
  },
  {
    path: 'mantenimientos',
    component: Mantenimientos
  },
  {
    path: 'clima',
    component: Clima
  },
  {
    path: '**',
    redirectTo: ''
  }
];