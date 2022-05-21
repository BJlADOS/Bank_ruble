import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-account-header-breadcrumb',
    templateUrl: './account-header-breadcrumb.component.html',
    styleUrls: ['./account-header-breadcrumb.component.scss']
})
export class AccountHeaderBreadcrumbComponent {

    @Input() public url!: string;
    @Input() public label!: string;

    constructor() { }

}
