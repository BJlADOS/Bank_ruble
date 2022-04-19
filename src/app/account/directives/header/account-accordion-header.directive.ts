import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[appAccountAccordionHeader]'
})
export class AccountAccordionHeaderDirective {
    //any
    constructor(public templateRef: TemplateRef<any>) { }


}
