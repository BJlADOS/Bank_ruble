import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { routing } from './main-routing.module';



@NgModule({
    declarations: [
        MainComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        routing
    ],
    bootstrap: [MainComponent]
})
export class MainModule { }
