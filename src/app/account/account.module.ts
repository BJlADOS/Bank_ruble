import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account-component/account.component';
import { accountRouting } from './account-routing.module';
import { AccountHeaderComponent } from './account-header/account-header.component';
import { AccountLeftMenuComponent } from './account-left-menu/account-left-menu.component';
import { AccountMainComponent } from './account-main/account-main.component';
import { AccountAccordionComponent } from './account-accordion/account-accordion.component';
import { AccountAccordionContentDirective } from './directives/content/account-accordion-content.directive';
import { AccountAccordionItemDirective } from './directives/item/account-accordion-item.directive';
import { AccountAccordionCardComponent } from './account-accordion-card/account-accordion-card.component';
import { AccountAddCardComponent } from './account-add-card/account-add-card.component';
import { AccountProfileMenuItemComponent } from './account-profile-menu-item/account-profile-menu-item.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';



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
    ],
    imports: [
        CommonModule,
        accountRouting
    ],
    bootstrap: [AccountComponent]
})
export class AccountModule { }
