import { Component, Input, OnInit } from '@angular/core';
import { ICard } from 'src/app/services/firestore/interfaces/Card';

@Component({
    selector: 'app-account-accordion-card',
    templateUrl: './account-accordion-card.component.html',
    styleUrls: ['./account-accordion-card.component.scss']
})
export class AccountAccordionCardComponent {

    @Input() public card!: ICard;

    constructor() { }

    public getLastFourDigits(): string {
        return this.card.cardNumber.slice(12, 16).toString();
    }

}
