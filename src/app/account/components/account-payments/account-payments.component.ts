import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { DestroyService } from 'src/app/services/destoyService/destroy.service';

@Component({
    selector: 'app-account-payments',
    templateUrl: './account-payments.component.html',
    styleUrls: ['./account-payments.component.scss']
})
export class AccountPaymentsComponent {

    constructor() { }

}
