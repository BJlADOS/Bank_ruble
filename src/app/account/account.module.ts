import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AccountComponent } from './components/account-component/account.component';
import { accountRouting } from './account-routing.module';
import { AccountHeaderComponent } from './components/account-header/account-header.component';
import { AccountLeftMenuComponent } from './components/account-left-menu/account-left-menu.component';
import { AccountMainComponent } from './components/account-main/account-main.component';
import { AccountAccordionComponent } from './components/account-accordion/account-accordion.component';
import { AccountAccordionContentDirective } from './directives/content/account-accordion-content.directive';
import { AccountAccordionItemDirective } from './directives/item/account-accordion-item.directive';
import { AccountAccordionCardComponent } from './components/account-accordion-card/account-accordion-card.component';
import { AccountAddCardComponent } from './components/account-add-card/account-add-card.component';
import { AccountProfileMenuItemComponent } from './components/account-profile-menu-item/account-profile-menu-item.component';
import { AccountProfileComponent } from './components/account-profile/account-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountProfileDataComponent } from './components/account-profile-data/account-profile-data.component';
import { AccountProfileEmailComponent } from './components/account-profile-email/account-profile-email.component';
import { NgxMaskModule } from 'ngx-mask';
import { AccountCardInfoComponent } from './components/account-card-info/account-card-info.component';
import { CardNumberPipe } from '../pipes/card-number/card-number.pipe';
import { CvvPipe } from '../pipes/cvv/cvv.pipe';
import { AccountPaymentsComponent } from './components/account-payments/account-payments.component';
import { AccountFastSendComponent } from './components/account-fast-send/account-fast-send.component';
import { NormalizeNumberDirective } from './directives/normalize-number/normalize-number.directive';
import { AccountHeaderBreadcrumbComponent } from './components/account-header-breadcrumb/account-header-breadcrumb.component';
import { AccountSendSelfComponent } from './components/account-send-self/account-send-self.component';
import { ModalDeleteCardComponent } from './components/modal-delete-card/modal-delete-card.component';
import { CardHistoryItemComponent } from './components/card-history-item/card-history-item.component';
import localeRU from '@angular/common/locales/ru';
import { SkeletonDirective } from '../Directives/skeleton/skeleton.directive';

registerLocaleData(localeRU, 'ru');
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
        AccountHeaderBreadcrumbComponent,
        AccountSendSelfComponent,
        ModalDeleteCardComponent,
        CardHistoryItemComponent,
        SkeletonDirective,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        accountRouting,
        NgxMaskModule.forRoot(),
    ],
    bootstrap: [AccountComponent],
    providers: [
        { provide: LOCALE_ID, useValue: 'ru' }
    ],
    exports: [
    ]
})
export class AccountModule { }
