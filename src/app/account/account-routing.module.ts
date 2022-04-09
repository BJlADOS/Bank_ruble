import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './accountComponent/account.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', component: AccountComponent },
    
];

export const accountRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
