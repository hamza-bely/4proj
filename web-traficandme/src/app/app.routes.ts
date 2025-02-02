import { Routes } from '@angular/router';
import {MapComponent} from './page/map/map.component';
import {HomeComponent} from './page/home/home.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: HomeComponent
  },
  {
    path: 'map',
    title: 'Map',
    component: MapComponent
  }

];
