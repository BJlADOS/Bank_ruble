import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ContentChildren, OnInit, QueryList } from '@angular/core';
import { AccountAccordionItemDirective } from '../directives/item/account-accordion-item.directive';

@Component({
    selector: 'app-account-accordion',
    templateUrl: './account-accordion.component.html',
    styleUrls: ['./account-accordion.component.scss'],
    animations: [
        trigger('contentExpansion', [
            state('expanded', style({ height: '*', opacity: 1, visibility: 'visible' })),
            state('collapsed', style({ height: '0', opacity: 0, visibility: 'hidden' })),
            transition('expanded <=> collapsed',
                animate('200ms cubic-bezier(.37,1.04,.68,.98)')),
        ])
    ]
})
export class AccountAccordionComponent {

    public expanded: Set<number> = new Set<number>();

    @ContentChildren(AccountAccordionItemDirective) public items!: QueryList<AccountAccordionItemDirective>;

    constructor() { }

    public getToggleState(index: number): Function {
        return this.getToggleState.bind(this, index);
    }

    public toggleState(index: number): void {
        if (this.expanded.has(index)) {
            this.expanded.delete(index);
        } else {
            this.expanded.add(index);
        }
    }

}
