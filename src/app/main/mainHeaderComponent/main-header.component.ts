import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { DestroyService } from 'src/app/services/destoyService/destroy.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { IUser } from 'src/app/services/firestore/interfaces/User';

@Component({
    selector: 'app-main-header',
    templateUrl: './main-header.component.html',
    styleUrls: ['./main-header.component.scss'],
    providers: [
        DestroyService,
    ]
})
export class MainHeaderComponent implements OnInit {
    public userName: string = 'Войти';
    
    constructor(
        public router: Router,
        private _fs: FirestoreService,
        private _destroy$: DestroyService
    ) { }

    public ngOnInit(): void {
        this._fs.getUser().pipe(takeUntil(this._destroy$)).subscribe((user: IUser | null) => {
            if (user) {
                if(user.firstName.length > 0) {
                    this.userName = user.firstName;
                } else {
                    this.userName = 'Пользователь';
                }               
            }
            else {
                this.userName = 'Войти';
            }
        });
    }

}
