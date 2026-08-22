import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'container',
        loadComponent: () => import('./container/container.component').then(c => c.ContainerComponent)
    }
];
