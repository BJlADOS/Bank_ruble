import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { FormManager } from 'src/app/classes/form-manager/form-manager';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { AlertService } from 'src/app/services/alert/alert.service';
import { DestroyService } from 'src/app/services/destoy/destroy.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { ICard } from 'src/app/services/firestore/interfaces/Card';
import { TransactionType } from 'src/app/services/firestore/interfaces/transaction';

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
    public isEnoughMoneyError: string | undefined;
    @Input() public defaultCardOverride: string | undefined = undefined;
    @Input() public isExpanded: boolean = false;

    constructor(
        public fs: FirestoreService,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public alert: AlertService,
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
                this.isEnoughMoneyError = '???????????????????????? ??????????????';
            } else if (value === 0) {
                this.isEnoughMoneyError = '?????????? ?????????????? ???????????? ???????? ??????????????????';
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
        this.fs.sendMoney((this.sendSelfForm.get('cardFrom')?.value as BehaviorSubject<ICard | null>).value!.cardNumber, (this.sendSelfForm.get('cardTo')?.value as BehaviorSubject<ICard | null>).value!.cardNumber, this.sendSelfForm.get('amount')?.value, TransactionType.self).then(() => {
            this.isExpanded = !this.isExpanded;
            this.alert.success('?????????????? ???????????????? ??????????????');
            this.isMoneySended = false;
            this.resetMoney();
            this.sendSelfForm.get('cardTo')?.patchValue(null);
        }).catch((error: Error) => {
            this.alert.error(error.message);
            this.isMoneySended = false;
        });
    }

    public expandToggle(): void {
        this.isExpanded = !this.isExpanded;
        this.resetCardSelect();
    }

    public cancel(): void {
        this.isMoneySended = false;
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
