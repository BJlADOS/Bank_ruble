import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ICard } from 'src/app/services/firestore/interfaces/Card';

@Component({
    selector: 'app-account-accordion-card',
    templateUrl: './account-accordion-card.component.html',
    styleUrls: ['./account-accordion-card.component.scss']
})
export class AccountAccordionCardComponent {

    @Input() public card$!: BehaviorSubject<ICard | null>;
    constructor(
        private _router: Router
    ) { }

    public isCardSelected(id: string | undefined): boolean {
        return this._router.url === `/account/card/${id}`;
    }

}
