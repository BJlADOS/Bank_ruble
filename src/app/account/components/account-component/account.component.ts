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
export class AccountComponent {


    constructor(
        public fs: FirestoreService,
        private _destroy$: DestroyService,
    ) { 
    }

}
