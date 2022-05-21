import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountAddCardComponent } from './components/account-add-card/account-add-card.component';
import { AccountCardInfoComponent } from './components/account-card-info/account-card-info.component';
import { AccountComponent } from './components/account-component/account.component';
import { AccountMainComponent } from './components/account-main/account-main.component';
import { AccountPaymentsComponent } from './components/account-payments/account-payments.component';
import { AccountProfileComponent } from './components/account-profile/account-profile.component';

const routes: Routes = [
    { path: '', component: AccountComponent, children: [
        { path: '', component: AccountMainComponent },
        { path: 'add-card', component: AccountAddCardComponent, data: { breadcrumb: 'Создать карту' } },
        { path: 'profile', component: AccountProfileComponent, data: { breadcrumb: 'Профиль' } },
        { path: 'card/:id', component: AccountCardInfoComponent, data: { breadcrumb: 'Информация о карте' } },
        { path: 'payments', component: AccountPaymentsComponent, data: { breadcrumb: 'Платежи' } },
    ] },
    
];

export const accountRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
