import { Component, OnInit } from '@angular/core';
import { Service, services } from 'src/assets/img/services/services';

@Component({
    selector: 'app-main-services',
    templateUrl: './main-services.component.html',
    styleUrls: ['./main-services.component.scss']
})
export class MainServicesComponent implements OnInit {

    public services!: Service[];

    constructor() { }

    public ngOnInit(): void {
        this.services = services;
        
    }

}
