import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Alert } from 'src/app/classes/alert/alert';
import { AlertService } from 'src/app/services/alert/alert.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { CardType } from 'src/app/services/firestore/types/card-type';

@Component({
    selector: 'app-account-add-card',
    templateUrl: './account-add-card.component.html',
    styleUrls: ['./account-add-card.component.scss'],
    animations: [
        trigger('contentExpansion', [
            state('expanded', style({ height: '*', opacity: 1, visibility: 'visible' })),
            state('collapsed', style({ height: '0', opacity: 0, visibility: 'hidden', padding: 0 })),
            transition('expanded <=> collapsed',
                animate('300ms cubic-bezier(.37,1.04,.68,.98)')),
        ])
    ]
})
export class AccountAddCardComponent {

    public isButtonsDisabled: boolean = false;

    constructor(
        private _fs: FirestoreService,
        private _router: Router,
        public alert: AlertService,
    ) { }

    public createCard(type: CardType): void {
        this.isButtonsDisabled = !this.isButtonsDisabled;
        this._fs.createCard(type).then(() => {
            this.alert.success('Карта успешно создана');
            setTimeout(() => {
                this._router.navigate(['/account']);
            }, 2000);
        }).catch((error: Error) => {
            this.isButtonsDisabled = !this.isButtonsDisabled;
            this.alert.error(error.message);
        });
    }
}
