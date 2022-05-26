import { Component } from '@angular/core';
import { DestroyService } from 'src/app/services/destoy/destroy.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

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
    ) { 
    }

}
