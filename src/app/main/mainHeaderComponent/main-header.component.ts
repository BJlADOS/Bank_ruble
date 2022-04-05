import { Component, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-main-header',
    templateUrl: './main-header.component.html',
    styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
    public userName: string = 'Войти';
    
    constructor(
        public router: Router,
        private _auth: Auth
    ) { }

    public ngOnInit(): void {
        this._auth.onAuthStateChanged((user: User | null): void => {
            if(user?.displayName) {
                this.userName = user!.displayName as string;
            }
            else if (user) {
                this.userName = 'Пользователь';
            }
        });
    }

}
