import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account-component/account.component';
import { accountRouting } from './account-routing.module';
import { AccountHeaderComponent } from './account-header/account-header.component';
import { AccountLeftMenuComponent } from './account-left-menu/account-left-menu.component';
import { AccountMainComponent } from './account-main/account-main.component';
import { AccountAccordionComponent } from './account-left-menu/account-accordion/account-accordion.component';
import { AccountAccordionContentDirective } from './directives/content/account-accordion-content.directive';
import { AccountAccordionItemDirective } from './directives/item/account-accordion-item.directive';
import { AccountAccordionCardComponent } from './account-left-menu/account-accordion/account-accordion-card/account-accordion-card.component';
import { AccountAddCardComponent } from './account-add-card/account-add-card.component';
import { AccountProfileMenuItemComponent } from './account-profile-menu-item/account-profile-menu-item.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountProfileDataComponent } from './account-profile/account-profile-data/account-profile-data.component';
import { AccountProfileEmailComponent } from './account-profile/account-profile-email/account-profile-email.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AccountCardInfoComponent } from './account-card-info/account-card-info.component';
import { CardNumberPipe } from '../pipes/card-number/card-number.pipe';
import { CvvPipe } from '../pipes/cvv/cvv.pipe';
import { AccountPaymentsComponent } from './account-payments/account-payments.component';
import { AccountFastSendComponent } from './account-main/account-fast-send/account-fast-send.component';
import { NormalizeNumberDirective } from './directives/normalize-number/normalize-number.directive';



@NgModule({
    declarations: [
        AccountComponent,
        AccountHeaderComponent,
        AccountLeftMenuComponent,
        AccountMainComponent,
        AccountAccordionComponent,
        AccountAccordionContentDirective,
        AccountAccordionItemDirective,
        AccountAccordionCardComponent,
        AccountAddCardComponent,
        AccountProfileMenuItemComponent,
        AccountProfileComponent,
        AccountProfileDataComponent,
        AccountProfileEmailComponent,
        AccountCardInfoComponent,
        CardNumberPipe,
        CvvPipe,
        AccountPaymentsComponent,
        AccountFastSendComponent,
        NormalizeNumberDirective,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        accountRouting,
        NgxMaskModule.forRoot(),
    ],
    bootstrap: [AccountComponent]
})
export class AccountModule { }
