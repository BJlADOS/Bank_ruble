import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './accountComponent/account.component';
import { accountRouting } from './account-routing.module';
import { AccountHeaderComponent } from './account-header/account-header.component';



@NgModule({
    declarations: [
        AccountComponent,
        AccountHeaderComponent,
    ],
    imports: [
        CommonModule,
        accountRouting
    ]
})
export class AccountModule { }
