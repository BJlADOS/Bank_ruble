import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { FormGenerator } from 'src/app/classes/FormGenerator/form-generator';
import { DestroyService } from 'src/app/services/destoyService/destroy.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { ICard } from 'src/app/services/firestore/interfaces/Card';
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
    public successMessage: string | undefined;
    public errorMessage: string | undefined;
    public isEnoughMoneyError: string | undefined;
    public moneyReceiver: string = '';

    constructor(
        public fs: FirestoreService,
        private _destroy$: DestroyService,
    ) { }

    public ngOnInit(): void {
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
            } else {
                this.isEnoughMoneyError = undefined;
            }
        });
    }

    public enrollCard(): void {
        this.isCardNumberEnrolled = true;
        FormGenerator.getInstance().updateMoneyAmountForm(this.moneyAmountForm, this.fs.getDefaultCard(), null);
        this.fs.findCardOwner(this.sendMoneyByCardNumberForm.get('cardNumber')?.value).then((user: IUser) => {
            this.moneyReceiver = `${user.firstName} ${user.surname} ${user.secondName}`;
        });
    }

    public sendMoney(): void {
        this.isMoneySended = true;
        this.fs.sendMoney((this.moneyAmountForm.get('card')?.value as BehaviorSubject<ICard | null>).value!.cardNumber, this.sendMoneyByCardNumberForm.get('cardNumber')?.value, this.moneyAmountForm.get('amount')?.value).then(() => {
            this.successMessage = 'Перевод выполнен успешно';
            setTimeout(() => {
                this.isMoneySended = false;
                this.isCardNumberEnrolled = false;
                this.resetForms();
                this.successMessage = undefined;
            }, 1000);
        }).catch((error: Error) => {
            this.errorMessage = error.message;
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
        this.errorMessage = undefined;
        this.resetForms();
    }

    private resetForms(): void {
        this.moneyReceiver = '';
        FormGenerator.getInstance().updateSendMoneyToCardForm(this.sendMoneyByCardNumberForm, '');
        FormGenerator.getInstance().updateMoneyAmountForm(this.moneyAmountForm, this.fs.getDefaultCard(), null);
    }
}
