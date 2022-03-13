import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    constructor(
        public router: Router
    ) { }

    public ngOnInit(): void {
        let a: number = 1;
        a = 2; //затычка
    }

    // signIn(): void {
    //     debugger;
    //     this.router.navigate(['/login'], {queryParams: {actualState: 'sign-in'}});
    // }
}
