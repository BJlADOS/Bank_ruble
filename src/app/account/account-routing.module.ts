import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountAddCardComponent } from './account-add-card/account-add-card.component';
import { AccountComponent } from './account-component/account.component';
import { AccountMainComponent } from './account-main/account-main.component';

const routes: Routes = [
    { path: '', component: AccountComponent, children: [
        { path: '', component: AccountMainComponent },
        { path: 'add-card', component: AccountAddCardComponent },
    ] },
    
];

export const accountRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
