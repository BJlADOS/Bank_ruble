import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/authService/auth.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    constructor(private _auth: AuthService, private _futh: Auth) { }

    public ngOnInit(): void {
        let a: number = 0;
        a = 1;
    }

}
