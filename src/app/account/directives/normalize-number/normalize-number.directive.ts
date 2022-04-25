import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[normalizeNumberInput]'
})
export class NormalizeNumberDirective {

    constructor(
        public elRef: ElementRef,
    ) { }

    @HostListener('input', ['$event.target'])
    public onInput(input: HTMLInputElement): void {
        input.value = input.value.replace(',', '.');
    }

}
