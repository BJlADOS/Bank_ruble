import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[appAccountAccordionTitle]'
})
export class AccountAccordionTitleDirective {
    //any
    constructor(public templateRef: TemplateRef<any>) { }

}
