import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './mainComponent/main.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', component: MainComponent },

];

export const mainRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
