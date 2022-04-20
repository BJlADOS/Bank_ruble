import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/authService/auth.service';
import { DestroyService } from 'src/app/services/destoyService/destroy.service';

@Component({
    selector: 'app-account-header',
    templateUrl: './account-header.component.html',
    styleUrls: ['./account-header.component.scss']
})
export class AccountHeaderComponent {

    constructor(
        public router: Router,
        private _auth: AuthService,
        private _destroy$: DestroyService,
    ) { }

    public logOut(): void {
        this._auth.logout();
    }

    public isActive(path: string): boolean {

        return this.router.url === path;
    }

}
