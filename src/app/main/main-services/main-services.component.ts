import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Service, services } from 'src/assets/img/services/services';

@Component({
    selector: 'app-main-services',
    templateUrl: './main-services.component.html',
    styleUrls: ['./main-services.component.scss']
})
export class MainServicesComponent implements OnInit {

    public services!: Service[];

    constructor(
        private _auth: AuthService,
        private _router: Router,
    ) { }

    public ngOnInit(): void {
        this.services = services;
    }

    public redirectTo(link: string): void {
        if (this._auth.user) {
            this._router.navigate([link]);
        } else {
            this._router.navigate(['login'],  { state: { redirectTo: link } });
        }   
    }
}
