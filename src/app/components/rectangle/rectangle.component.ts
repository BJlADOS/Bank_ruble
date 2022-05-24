import { trigger, transition, style, animate } from '@angular/animations';
import { Component, ElementRef, HostBinding, OnInit, Renderer2 } from '@angular/core';

@Component({
    selector: 'app-rectangle',
    templateUrl: './rectangle.component.html',
    styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent implements OnInit {

    @HostBinding('class.pulse') public get valid(): boolean { return true; }

    public width: string | undefined;
    public height: string | undefined;
    public className: string | undefined;

    constructor(
        private _host: ElementRef<HTMLElement>,
        private _renderer: Renderer2,
    ) { }

    public ngOnInit(): void {
        const host: HTMLElement = this._host.nativeElement;
        if (this.className) {
            host.classList.add(this.className);
        }

        host.style.setProperty('--skeleton-rect-width', this.width ?? '100%');
        host.style.setProperty('--skeleton-rect-height', this.height ?? '100%');
    }

}
