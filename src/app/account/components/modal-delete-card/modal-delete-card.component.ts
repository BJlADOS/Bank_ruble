import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { textAppears } from 'src/app/animations/text-appears/text-appers';
import { Modal } from 'src/app/classes/modal/modal';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
    selector: 'app-modal-delete-card',
    templateUrl: './modal-delete-card.component.html',
    styleUrls: ['./modal-delete-card.component.scss'],
    animations: [
        textAppears,
    ]
})
export class ModalDeleteCardComponent extends Modal {

    private _cardId: string = '';
    private _cardNumber: string = '';
    
    constructor(
        private _fs: FirestoreService,
        private _router: Router,
    ) {
        super();
    }

    public onInjectInputs(inputs: any): void {
        this._cardId = inputs.id;
        this._cardNumber = inputs.cardNumber;
    }

    public confirm(): void {
        this._fs.deleteCard(this._cardNumber ,this._cardId).then(() => {
            this._router.navigate(['/account']);
        });
        this.close('confirm');
    }

    public cancel(): void {
        this.dismiss('cancel');
    }
}
