import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/services/firestore/interfaces/User';

@Component({
    selector: 'app-account-profile-menu-item',
    templateUrl: './account-profile-menu-item.component.html',
    styleUrls: ['./account-profile-menu-item.component.scss']
})
export class AccountProfileMenuItemComponent {

    @Input() public user$!: Observable<IUser | null>;

    constructor() { }

}
