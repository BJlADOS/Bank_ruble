import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';

@Component({
    selector: 'app-account-header',
    templateUrl: './account-header.component.html',
    styleUrls: ['./account-header.component.scss']
})
export class AccountHeaderComponent implements OnInit {

    constructor(private _auth: AuthService) { }

    public ngOnInit(): void {
        let a: number = 0;
        a = 1;
    }

    public logOut(): void {
        this._auth.logout();
    }

}
