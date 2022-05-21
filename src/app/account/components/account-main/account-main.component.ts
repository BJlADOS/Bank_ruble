import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { FormGenerator } from 'src/app/classes/FormGenerator/form-generator';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
    selector: 'app-account-main',
    templateUrl: './account-main.component.html',
    styleUrls: ['./account-main.component.scss'],
    animations: [
        contentExpansion,
    ]
})
export class AccountMainComponent implements OnInit {

    constructor(
        private _fs: FirestoreService
    ) { }

    public ngOnInit(): void {
        let a: number = 0;
        a++;
    }

}
