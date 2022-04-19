import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { CardType } from 'src/app/services/firestore/types/card-type';

@Component({
    selector: 'app-account-add-card',
    templateUrl: './account-add-card.component.html',
    styleUrls: ['./account-add-card.component.scss']
})
export class AccountAddCardComponent {

    public successMessage: string = '';
    public errorMessage: string = '';
    public isError: boolean = false;
    public isSuccess: boolean = false;
    public isButtonsDisabled: boolean = false;

    constructor(
        private _fs: FirestoreService,
        private _router: Router
    ) { }

    public createCard(type: CardType): void {
        this.isButtonsDisabled = !this.isButtonsDisabled;
        this._fs.createCard(type).then(() => {
            this.isError = false;
            this.isSuccess = true;
            this.successMessage = 'Карта успешно создана';
            setTimeout(() => {
                this._router.navigate(['/account']);
            }, 2000);   
        }       
        )
            .catch((error: Error) => {
                this.isButtonsDisabled = !this.isButtonsDisabled;
                this.errorMessage = error.message;
                this.isError = true;
            });
    }
}
