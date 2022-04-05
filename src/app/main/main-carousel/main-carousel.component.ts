import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { images } from 'src/assets/img/carousel/images';
@Component({
    selector: 'app-main-carousel',
    templateUrl: './main-carousel.component.html',
    styleUrls: ['./main-carousel.component.scss'],
    animations: [
        trigger('carouselAnimation', [
            transition('void=>*', [
                style({ opacity: 0 }),
                animate('.5s', style({ opacity: 1 }))
            ])
        ])
    ]
})
export class MainCarouselComponent implements OnInit, AfterViewInit {

    public images!: Array<{src: string}>;
    public currentIndex: number = 0;
    public delay: number = 5000;
    public pauseDelay: number = 10000;

    private _carouselTimer!: NodeJS.Timeout;
    private _callback!: () => void;
    constructor() { 
    }
    public ngAfterViewInit(): void {
        document.getElementById(`i${this.currentIndex}`)!.classList.add('im1');
        const rad: HTMLInputElement | null = document.getElementById(`r${this.currentIndex}`) as HTMLInputElement;
        rad.checked = true;
        this.updateBar();
        this._carouselTimer = setTimeout(this._callback, this.delay);
    }

    public ngOnInit(): void {
        this.images = images;
        this._callback = (): void => this.next();
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
        clearTimeout(this._carouselTimer);
        const bars: HTMLCollectionOf<Element> = document.getElementsByClassName('main__carousel__navigation__bar')!;
        for (let i: number = 0; i < bars.length; i++) {           
            bars[i].classList.remove('selected');
        }
        const bar: HTMLElement = document.getElementById(`b${this.currentIndex}`)!;
        bar.classList.add('selected');
        this._carouselTimer = setTimeout(this._callback, this.delay);
    }

    public updateCarousel(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        this.currentIndex = parseInt(target.id[1]);
        this.updateBar();
    }

}
