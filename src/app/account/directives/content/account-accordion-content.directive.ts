import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[appAccountAccordionContent]'
})
export class AccountAccordionContentDirective {
    //any
    constructor(public templateRef: TemplateRef<HTMLElement>) { }

}
