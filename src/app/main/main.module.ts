import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './mainComponent/main.component';
import { RouterModule } from '@angular/router';
import { routing } from './main-routing.module';
import { MainHeaderComponent } from './mainHeaderComponent/main-header.component';
import { MainCarouselComponent } from './main-carousel/main-carousel.component';
import { MainServicesComponent } from './main-services/main-services.component';



@NgModule({
    declarations: [
        MainComponent,
        MainHeaderComponent,
        MainCarouselComponent,
        MainServicesComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        routing
    ],
    bootstrap: [MainComponent]
})
export class MainModule { }
