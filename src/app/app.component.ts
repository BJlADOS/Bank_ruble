import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { FirestoreService } from './services/firestore/firestore.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

    public title: string = 'Bank_ruble';

    constructor(
        private _a: AuthService,
        private _f: FirestoreService
    ) { }

    public ngOnInit(): void {
        this._a.init();
        this._f.init();
    }

}
