import { ContentChild, Directive, Input } from '@angular/core';
import { AccountAccordionContentDirective } from '../content/account-accordion-content.directive';
import { AccountAccordionHeaderDirective } from '../header/account-accordion-header.directive';
import { AccountAccordionTitleDirective } from '../title/account-accordion-title.directive';

@Directive({
    selector: 'appAccountAccordionItem'
})
export class AccountAccordionItemDirective {
    
    @Input() public title: string = '';
    @Input() public redirectPath: string = '';
    
    @ContentChild(AccountAccordionContentDirective) public content!: AccountAccordionContentDirective;
}
