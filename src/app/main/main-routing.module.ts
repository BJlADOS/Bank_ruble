import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, AuthPipe, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MainComponent } from './mainComponent/main.component';

const redirectUnauthorizedToLogin = (): AuthPipe => redirectUnauthorizedTo('login');
const redirectLoggedInToAccount = (): AuthPipe => redirectLoggedInTo('/account');

const routes: Routes = [
    { path: '', pathMatch: 'full', component: MainComponent },

];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
