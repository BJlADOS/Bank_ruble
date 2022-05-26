import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, filter, Observable, takeUntil } from 'rxjs';
import { DestroyService } from 'src/app/services/destoy/destroy.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { ICard } from 'src/app/services/firestore/interfaces/Card';
import { IUser } from 'src/app/services/firestore/interfaces/User';

@Component({
    selector: 'app-account-left-menu',
    templateUrl: './account-left-menu.component.html',
    styleUrls: ['./account-left-menu.component.scss']
})
export class AccountLeftMenuComponent implements OnInit {
    public user$!: Observable<IUser | null>;
    public user!: IUser | null;
    public cards$!: Observable<Array<BehaviorSubject<ICard | null>>>;

    constructor(
        private _destroy$: DestroyService,
        public fs: FirestoreService
    ) { }

    public ngOnInit(): void {
        setTimeout(()=> {
            this.user$;
        }, 1000); //Костыль, без него не грузит
        this.user$ = this.fs.getUser();
        this.fs.getUser().pipe(filter((user: IUser | null) => user !== null) ,takeUntil(this._destroy$)).subscribe((user: IUser | null) => {
            this.user = user;
            this.cards$ =  this.fs.getUserCards();
        });
        
    }

}
