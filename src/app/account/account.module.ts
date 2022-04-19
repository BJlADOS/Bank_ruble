import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account-component/account.component';
import { accountRouting } from './account-routing.module';
import { AccountHeaderComponent } from './account-header/account-header.component';
import { AccountLeftMenuComponent } from './account-left-menu/account-left-menu.component';
import { AccountMainComponent } from './account-main/account-main.component';
import { AccountAccordionComponent } from './account-accordion/account-accordion.component';
import { AccountAccordionContentDirective } from './directives/content/account-accordion-content.directive';
import { AccountAccordionHeaderDirective } from './directives/header/account-accordion-header.directive';
import { AccountAccordionItemDirective } from './directives/item/account-accordion-item.directive';
import { AccountAccordionTitleDirective } from './directives/title/account-accordion-title.directive';
import { AccountAccordionCardComponent } from './account-accordion-card/account-accordion-card.component';
import { AccountAddCardComponent } from './account-add-card/account-add-card.component';



@NgModule({
    declarations: [
        AccountComponent,
        AccountHeaderComponent,
        AccountLeftMenuComponent,
        AccountMainComponent,
        AccountAccordionComponent,
        AccountAccordionContentDirective,
        AccountAccordionHeaderDirective,
        AccountAccordionItemDirective,
        AccountAccordionTitleDirective,
        AccountAccordionCardComponent,
        AccountAddCardComponent,
    ],
    imports: [
        CommonModule,
        accountRouting
    ],
    bootstrap: [AccountComponent]
})
export class AccountModule { }
