import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { BehaviorSubject, filter, takeUntil } from 'rxjs';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { FormManager } from 'src/app/classes/form-manager/form-manager';
import { FormGenerator } from 'src/app/classes/FormGenerator/form-generator';
import { AlertService } from 'src/app/services/alert/alert.service';
import { DestroyService } from 'src/app/services/destoyService/destroy.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { ICard } from 'src/app/services/firestore/interfaces/Card';
import { TransactionType } from 'src/app/services/firestore/interfaces/transaction';
import { IUser } from 'src/app/services/firestore/interfaces/User';

@Component({
    selector: 'app-account-fast-send',
    templateUrl: './account-fast-send.component.html',
    styleUrls: ['./account-fast-send.component.scss'],
    animations: [
        contentExpansion,
    ]
})
export class AccountFastSendComponent implements OnInit {

    public sendMoneyByCardNumberForm: FormGroup = FormGenerator.getInstance().getSendMoneyToCardForm();
    public isCardExists: boolean = false;
    public existCheckErrorMessage: string | undefined;
    public isCardNumberEnrolled: boolean = false;
    public moneyAmountForm: FormGroup = FormGenerator.getInstance().getMoneyAmountForm();
    public isMoneySended: boolean = false;
    public isEnoughMoneyError: string | undefined;
    public moneyReceiver: string = '';
    public defaultCardOverride: string | undefined = undefined;

    constructor(
        public fs: FirestoreService,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public alert: AlertService,
        private _destroy$: DestroyService,
    ) { 
        if (this.router.getCurrentNavigation()?.extras.state) {
            this.defaultCardOverride = this.router.getCurrentNavigation()?.extras.state!['defaultCardOverride'];
        }
    }

    public ngOnInit(): void {
        //take card from router status
        //then patch into form select
        this.sendMoneyByCardNumberForm.get('cardNumber')?.valueChanges.pipe(takeUntil(this._destroy$)).subscribe((value: string) => {
            if(value.length === 16) {
                this.isCardExistsCheck();
            } else {
                this.existCheckErrorMessage = undefined;
            }
        });
        this.moneyAmountForm.get('amount')?.valueChanges.pipe(takeUntil(this._destroy$)).subscribe((value: number | null) => {
            if ((this.moneyAmountForm.get('card')?.value as BehaviorSubject<ICard | null>).value!.balance < value!) {
                this.isEnoughMoneyError = 'Недостаточно средств';
            } else if (value === 0) {
                this.isEnoughMoneyError = 'Сумма платежа должна быть ненулевой';
            } else {
                this.isEnoughMoneyError = undefined;
            }
        });
        this.moneyAmountForm.get('card')?.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(() => {
            this.isEnoughMoneyError = undefined;
            this.resetMoneyForm();
        });
    }

    public enrollCard(): void {
        this.isCardNumberEnrolled = true;
        this.resetCardSelect();
        this.fs.findCardOwner(this.sendMoneyByCardNumberForm.get('cardNumber')?.value).then((user: IUser) => {
            this.moneyReceiver = `${user.surname} ${user.firstName} ${user.secondName}`;
        });
    }

    public sendMoney(): void {
        this.isMoneySended = true;
        this.fs.sendMoney((this.moneyAmountForm.get('card')?.value as BehaviorSubject<ICard | null>).value!.cardNumber, this.sendMoneyByCardNumberForm.get('cardNumber')?.value, this.moneyAmountForm.get('amount')?.value, TransactionType.to).then(() => {
            this.alert.success('Перевод выполнен успешно');
            setTimeout(() => {
                this.isMoneySended = false;
                this.isCardNumberEnrolled = false;
                this.resetForms();
            }, 1000);
        }).catch((error: Error) => {
            this.alert.error(error.message);
            this.isMoneySended = false;
        });
    }

    public isCardExistsCheck(): void {
        if (this.sendMoneyByCardNumberForm.get('cardNumber')?.value.length === 16) {
            this.fs.checkCardNumberForFastSend(this.sendMoneyByCardNumberForm.get('cardNumber')?.value).then((exists: boolean) => {
                //always true
                this.existCheckErrorMessage = undefined;
                this.isCardExists = exists;
            }).catch((error: Error) => {
                this.existCheckErrorMessage = error.message;
                this.isCardExists = false;
            });
        }
    }

    public cancel(): void {
        this.isMoneySended = false;
        this.isCardNumberEnrolled = false;
        this.resetForms();
    }

    private resetForms(): void {
        this.moneyReceiver = '';
        this.resetCardSelect();
        this.resetMoneyForm();
    }

    private resetMoneyForm(): void {
        FormManager.getInstance().updateMoneyInMoneyAmountForm(this.moneyAmountForm, null);
    }

    private resetCardSelect(): void {
        //patch card here, if exists
        if (this.defaultCardOverride) {
            FormManager.getInstance().updateCardInMoneyAmountForm(this.moneyAmountForm, this.fs.findCardSubjectdById(this.defaultCardOverride));
        } else {
            FormManager.getInstance().updateCardInMoneyAmountForm(this.moneyAmountForm, this.fs.getDefaultCard());
        }
    }
}
