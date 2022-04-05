import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { images } from 'src/assets/img/carousel/images';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    animations: [
        trigger('carouselAnimation', [
            transition('void=>*', [
                style({ opacity: 0 }),
                animate('.5s', style({ opacity: 1 }))
            ])
        ])
    ]
})
export class MainComponent implements OnInit, AfterViewInit {

    public images!: Array<{src: string}>;
    public currentIndex: number = 0;
    constructor() { 
    }
    public ngAfterViewInit(): void {
        document.getElementById(`i${this.currentIndex}`)!.classList.add('im1');
        const rad: HTMLInputElement | null = document.getElementById(`r${this.currentIndex}`) as HTMLInputElement;
        rad.checked = true;
        this.updateBar();
    }

    public ngOnInit(): void {
        this.images = images;
    }

    public next(): void {
        if (this.currentIndex === images.length - 1) {
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }
        const rad: HTMLInputElement | null = document.getElementById(`r${this.currentIndex}`) as HTMLInputElement;
        rad.checked = true;
        this.updateBar();
    }

    public previous(): void {
        if (this.currentIndex === 0) {
            this.currentIndex = images.length - 1;
        } else {
            this.currentIndex--;
        }
        const rad: HTMLInputElement | null = document.getElementById(`r${this.currentIndex}`) as HTMLInputElement;
        rad.checked = true;
        this.updateBar();
    }

    public updateBar(): void {
        const bars: HTMLCollectionOf<Element> = document.getElementsByClassName('main__carousel__navigation__bar')!;
        for (let i: number = 0; i < bars.length; i++) {           
            bars[i].classList.remove('selected');
        }
        const bar: HTMLElement = document.getElementById(`b${this.currentIndex}`)!;
        bar.classList.add('selected');
    }

    public updateCarousel(event: Event): void {
        console.log(event);
        const target: HTMLInputElement = event.target as HTMLInputElement;
        this.currentIndex = parseInt(target.id[1]);
        this.updateBar();
    }
}
