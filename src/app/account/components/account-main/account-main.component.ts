import { Component } from '@angular/core';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';

@Component({
    selector: 'app-account-main',
    templateUrl: './account-main.component.html',
    styleUrls: ['./account-main.component.scss'],
    animations: [
        contentExpansion,
    ]
})
export class AccountMainComponent {

    constructor() { }


}
