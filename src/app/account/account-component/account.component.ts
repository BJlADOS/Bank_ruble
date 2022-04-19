import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DestroyService } from 'src/app/services/destoyService/destroy.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { IUser } from 'src/app/services/firestore/interfaces/User';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    providers: [
        DestroyService,
    ]
})
export class AccountComponent implements OnInit {

    public user$!: Observable<IUser | null>;
    public user!: IUser| null;

    constructor(
        private _fs: FirestoreService,
        private _destroy$: DestroyService,
        public ff: Firestore
    ) { 
    }

    public ngOnInit(): void {
        
    }

}
