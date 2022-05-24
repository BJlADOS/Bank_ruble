import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard, AuthPipe, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MainModule } from './main/main.module';

const redirectUnauthorizedToLogin = (): AuthPipe => redirectUnauthorizedTo('login');
const redirectLoggedInToAccount = (): AuthPipe => redirectLoggedInTo('account');

const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main', loadChildren: () => import('./main/main.module').then((m: typeof import('./main/main.module')): typeof MainModule => m.MainModule) },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectLoggedInToAccount } },
    { path: 'account', loadChildren: () => import('./account/account.module').then((m: typeof import('./account/account.module')): typeof MainModule => m.AccountModule), canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);
