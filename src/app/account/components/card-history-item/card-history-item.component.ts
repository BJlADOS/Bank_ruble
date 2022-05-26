import { Component, Input, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { ITransaction, ITransactionTarget } from 'src/app/services/firestore/interfaces/transaction';

@Component({
    selector: 'app-card-history-item',
    templateUrl: './card-history-item.component.html',
    styleUrls: ['./card-history-item.component.scss']
})
export class CardHistoryItemComponent implements OnInit {

    @Input() public cardNumber!: string;
    @Input() public cardName!: string;
    @Input() public transaction!: ITransaction;
    public isWithdrawal: boolean = false;
    public target: ITransactionTarget | undefined;

    constructor(
        private _fs: FirestoreService,
    ) { }

    public ngOnInit(): void {
        switch(this.cardNumber) {
            case this.transaction.from: 
                this.isWithdrawal = true;
                break;
            case this.transaction.to: 
                this.isWithdrawal = false;
                break;
        }
        this.getTarget();
    }

    private getTarget(): void {
        const targetNumber: string = this.isWithdrawal? this.transaction.to : this.transaction.from;
        this._fs.getTransactionTarget(targetNumber, this.transaction.type).then((target: ITransactionTarget) =>
        {
            this.target = target;
        });
    }

}
