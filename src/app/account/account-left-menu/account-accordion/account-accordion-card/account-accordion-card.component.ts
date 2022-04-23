import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { ICard } from 'src/app/services/firestore/interfaces/Card';

@Component({
    selector: 'app-account-accordion-card',
    templateUrl: './account-accordion-card.component.html',
    styleUrls: ['./account-accordion-card.component.scss']
})
export class AccountAccordionCardComponent {

    @Input() public card$!: BehaviorSubject<ICard | null>;
    constructor() { }

}
