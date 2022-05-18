import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { BehaviorSubject, filter, takeUntil } from 'rxjs';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { FormManager } from 'src/app/classes/form-manager/form-manager';
import { FormGenerator } from 'src/app/classes/FormGenerator/form-generator';
import { DestroyService } from 'src/app/services/destoyService/destroy.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { ICard } from 'src/app/services/firestore/interfaces/Card';

@Component({
    selector: 'app-account-send-self',
    templateUrl: './account-send-self.component.html',
    styleUrls: ['./account-send-self.component.scss'],
    animations: [
        contentExpansion,
    ]
})
export class AccountSendSelfComponent implements OnInit {

    public sendSelfForm: FormGroup = FormGenerator.getInstance().getSendSelfForm();
    public isMoneySended: boolean = false;
    public successMessage: string | undefined;
    public errorMessage: string | undefined;
    public isEnoughMoneyError: string | undefined;
    @Input() public defaultCardOverride: string | undefined = undefined;
    @Input() public isExpanded: boolean = false;

    constructor(        
        public fs: FirestoreService,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        private _destroy$: DestroyService
    ) { 
        if (this.router.getCurrentNavigation()?.extras.state) {
            this.defaultCardOverride = this.router.getCurrentNavigation()?.extras.state!['defaultCardOverride'];
            this.isExpanded = this.router.getCurrentNavigation()?.extras.state!['isSendingSelf'];
        }
    }

    public ngOnInit(): void {
        this.sendSelfForm.get('amount')?.valueChanges.pipe(takeUntil(this._destroy$)).subscribe((value: number | null) => {
            if ((this.sendSelfForm.get('cardFrom')?.value as BehaviorSubject<ICard | null>).value!.balance < value!) {
                this.isEnoughMoneyError = 'Недостаточно средств';
            } else if (value === 0) {
                this.isEnoughMoneyError = 'Сумма платежа должна быть ненулевой';
            } else {
                this.isEnoughMoneyError = undefined;
            }
        });
        this.sendSelfForm.get('cardFrom')?.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(() => {
            this.isEnoughMoneyError = undefined;
            this.resetMoney();
        });
        this.resetCardSelect();
    }

    public sendMoney(): void {
        this.isMoneySended = true;
        this.fs.sendMoney((this.sendSelfForm.get('cardFrom')?.value as BehaviorSubject<ICard | null>).value!.cardNumber, (this.sendSelfForm.get('cardTo')?.value as BehaviorSubject<ICard | null>).value!.cardNumber, this.sendSelfForm.get('amount')?.value).then(() => {
            this.successMessage = 'Перевод выполнен успешно';
            this.errorMessage = undefined;
            setTimeout(() => {
                this.isMoneySended = false;
                this.resetMoney();
                this.successMessage = undefined;
                this.isExpanded = !this.isExpanded;
            }, 1000);
        }).catch((error: Error) => {
            this.errorMessage = error.message;
            this.isMoneySended = false;
        });
    }

    public expandToggle(): void {
        this.isExpanded = !this.isExpanded;
        this.resetCardSelect();
    }

    public cancel(): void {
        this.isMoneySended = false;
        this.errorMessage = undefined;
        this.isExpanded = false;
        this.resetMoney();
    }

    private resetMoney(): void {
        FormManager.getInstance().updateMoneyInSendSelfForm(this.sendSelfForm, null);
    }

    private resetCardSelect(): void {      
        if (this.defaultCardOverride) {
            FormManager.getInstance().updateCardsInSendSelfForm(this.sendSelfForm, this.fs.findCardSubjectdById(this.defaultCardOverride));
        } else {
            FormManager.getInstance().updateCardsInSendSelfForm(this.sendSelfForm, this.fs.getDefaultCard());
        }
    }
}
