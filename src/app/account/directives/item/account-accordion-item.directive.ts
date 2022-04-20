import { ContentChild, Directive, Input } from '@angular/core';
import { AccountAccordionContentDirective } from '../content/account-accordion-content.directive';

@Directive({
    selector: 'appAccountAccordionItem'
})
export class AccountAccordionItemDirective {
    
    @Input() public title: string = '';
    @Input() public redirectPath: string = '';
    
    @ContentChild(AccountAccordionContentDirective) public content!: AccountAccordionContentDirective;
}
