import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { ModalRef } from 'src/app/classes/modal/modalRef';
import { DestroyService } from 'src/app/services/destoyService/destroy.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { ICard } from 'src/app/services/firestore/interfaces/Card';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ModalDeleteCardComponent } from '../modal-delete-card/modal-delete-card.component';

@Component({
    selector: 'app-account-card-info',
    templateUrl: './account-card-info.component.html',
    styleUrls: ['./account-card-info.component.scss'],
    animations: [contentExpansion]
})
export class AccountCardInfoComponent implements OnInit {

    public card$!: Observable<ICard | null>;
    public errorMessage: string | undefined;
    public isCardNumberHidden: boolean = true;
    public isCvvHidden: boolean = true;
    public moneyReceiver: string = '';


    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _fs: FirestoreService,
        private _destroy$: DestroyService,
        private _modalServise: ModalService,
    ) { }

    public ngOnInit(): void {
        this._activatedRoute.paramMap.pipe(takeUntil(this._destroy$)).subscribe((paramMap: ParamMap) => {
            const cardIdFormRoute: string = paramMap.get('id') as string;
            this.isCardNumberHidden = true;
            this.isCvvHidden = true;
            this.errorMessage = undefined;
            try {
                this.card$ = this._fs.getUserCardById(cardIdFormRoute);
            }
            catch {
                this.errorMessage = 'Извините, но такая карта не найдена';
            }
        });

    }

    public toggleCardNumber(): void {
        this.isCardNumberHidden = !this.isCardNumberHidden;
    }

    public toggleCvv(): void {
        this.isCvvHidden = !this.isCvvHidden;
    }

    public toggleBan(card: ICard): void {
        this._fs.banToggleCard(card);
    }

    public isDefault(card: ICard): boolean {
        return this._fs.isCardDefaultById(card.id);
    }

    public redirectToPayments(defaultCardOverride: string, isSendingSelf: boolean = false): void {
        this._router.navigate(['/account/payments'], { state: { defaultCardOverride: defaultCardOverride, isSendingSelf: isSendingSelf } });
    }

    public setCardAsDefault(id: string): void {
        this._fs.setDefaultCardById(id);
    }

    public deleteCard(cardNumber: string, id: string): void {
        const modalRef: ModalRef = this._modalServise.open(ModalDeleteCardComponent, {
            id: id,
            cardNumber: cardNumber,
        });
        // this._fs.deleteCard(cardNumber, id).then(() => {
        //     this._router.navigate(['/account']);
        // });
    }
}
