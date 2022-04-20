import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
    selector: 'app-account-main',
    templateUrl: './account-main.component.html',
    styleUrls: ['./account-main.component.scss']
})
export class AccountMainComponent implements OnInit {

    constructor(private _fs: FirestoreService) { }

    public ngOnInit(): void {
        let a: number = 0;
        a++;
    }

}
