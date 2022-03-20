import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard, AuthPipe, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MainModule } from './main/main.module';

const redirectUnauthorizedToLogin = (): AuthPipe => redirectUnauthorizedTo('login');
const redirectLoggedInToAccount = (): AuthPipe => redirectLoggedInTo('/account');

const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main', loadChildren: () => import('./main/main.module').then((m: typeof import('c:/Users/User/Desktop/Bank_ruble/src/app/main/main.module')): typeof MainModule => m.MainModule) },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectLoggedInToAccount } },
    { path: 'account', component: AccountComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);
