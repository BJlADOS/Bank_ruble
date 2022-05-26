import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './mainComponent/main.component';
import { RouterModule } from '@angular/router';
import { mainRouting } from './main-routing.module';
import { MainHeaderComponent } from './mainHeaderComponent/main-header.component';
import { MainCarouselComponent } from './main-carousel/main-carousel.component';
import { MainServicesComponent } from './main-services/main-services.component';
import { MainNewsComponent } from './main-news/main-news.component';
import { NewsComponent } from './news/news.component';
import { MainFooterComponent } from './main-footer/main-footer.component';



@NgModule({
    declarations: [
        MainComponent,
        MainHeaderComponent,
        MainCarouselComponent,
        MainServicesComponent,
        MainNewsComponent,
        NewsComponent,
        MainFooterComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        mainRouting
    ],
    bootstrap: [MainComponent]
})
export class MainModule { }
