import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountAddCardComponent } from './account-add-card/account-add-card.component';
import { AccountCardInfoComponent } from './account-card-info/account-card-info.component';
import { AccountComponent } from './account-component/account.component';
import { AccountMainComponent } from './account-main/account-main.component';
import { AccountPaymentsComponent } from './account-payments/account-payments.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';

const routes: Routes = [
    { path: '', component: AccountComponent, children: [
        { path: '', component: AccountMainComponent },
        { path: 'add-card', component: AccountAddCardComponent },
        { path: 'profile', component: AccountProfileComponent },
        { path: 'card/:id', component: AccountCardInfoComponent },
        { path: 'payments', component: AccountPaymentsComponent },
    ] },
    
];

export const accountRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
