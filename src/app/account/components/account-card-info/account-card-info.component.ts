import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, takeUntil } from 'rxjs';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { ModalRef } from 'src/app/classes/modal/modalRef';
import { AlertService } from 'src/app/services/alert/alert.service';
import { DestroyService } from 'src/app/services/destoyService/destroy.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { ICard } from 'src/app/services/firestore/interfaces/Card';
import { ITransaction } from 'src/app/services/firestore/interfaces/transaction';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ModalDeleteCardComponent } from '../modal-delete-card/modal-delete-card.component';

@Component({
    selector: 'app-account-card-info',
    templateUrl: './account-card-info.component.html',
    styleUrls: ['./account-card-info.component.scss'],
    animations: [contentExpansion]
})
export class AccountCardInfoComponent implements OnInit, OnDestroy {

    public card$!: Observable<ICard | null>;
    public isCardNumberHidden: boolean = true;
    public isCvvHidden: boolean = true;
    public moneyReceiver: string = '';
    public isLoading: boolean = true;
    public history: Array<DocumentReference<DocumentData>> = [];
    public transactions: ITransaction[] = [];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _fs: FirestoreService,
        private _destroy$: DestroyService,
        private _modalServise: ModalService,
        private _alert: AlertService,
    ) { }

    public ngOnInit(): void {
        this._activatedRoute.paramMap.pipe(takeUntil(this._destroy$)).subscribe((paramMap: ParamMap) => {
            const cardIdFormRoute: string = paramMap.get('id') as string;
            this.isCardNumberHidden = true;
            this.isCvvHidden = true;
            this.transactions = [];
            this.history = [];
            this.isLoading = true;
            this.card$ = this._fs.getUserCardById(cardIdFormRoute);
            this._fs.getCardHistory(cardIdFormRoute).pipe(takeUntil(this._destroy$)).subscribe((data: Array<DocumentReference<DocumentData>>) => {
                this.history = data;
                if(data.length > 0) {
                    this.isLoading = true;
                    this.checkPosition();
                } else {
                    this.isLoading = false;
                }            
            });
        });
        window.addEventListener('scroll', this.throttle(this.checkPosition.bind(this), 250));
        window.addEventListener('resize', this.throttle(this.checkPosition.bind(this), 250));
    }

    public ngOnDestroy(): void {
        window.removeEventListener('scroll', this.throttle(this.checkPosition.bind(this), 250));
        window.removeEventListener('resize', this.throttle(this.checkPosition.bind(this), 250));
        this._fs.unsubFromHistory();
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

    private async checkPosition(): Promise<void> {
        const height: number = document.body.offsetHeight;
        const screenHeight: number = window.innerHeight;

        const scrolled: number = window.scrollY;

        const threshold: number = height - screenHeight / 4;

        const position: number = scrolled + screenHeight;
        if (position >= threshold && this.history.length !== this.transactions.length) {
            const transactions: ITransaction[] = await this._fs.loadTransactions(this.history, this.transactions.length, 10);
            for (const transaction of transactions) {
                this.transactions.push(transaction);
            }
            this.isLoading = false;
        }
    }

    private throttle(callee: Function, timeout: number): EventListener {
        let timer: NodeJS.Timeout | null = null;

        return function perform() {
            if (timer) { return; };

            timer = setTimeout(() => {
                callee();

                clearTimeout(timer!);
                timer = null;
            }, timeout);
        };
    }

}
