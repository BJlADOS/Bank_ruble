import { Component, ContentChildren, OnInit, QueryList } from '@angular/core';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { AccountAccordionItemDirective } from '../../directives/item/account-accordion-item.directive';

@Component({
    selector: 'app-account-accordion',
    templateUrl: './account-accordion.component.html',
    styleUrls: ['./account-accordion.component.scss'],
    animations: [
        contentExpansion,
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
