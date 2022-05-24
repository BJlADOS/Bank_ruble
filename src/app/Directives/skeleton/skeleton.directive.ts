import { ComponentRef, Directive, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { RectangleComponent } from 'src/app/components/rectangle/rectangle.component';

@Directive({
    selector: '[skeleton]'
})
export class SkeletonDirective implements OnChanges {

    @Input() public skeleton: boolean = false;;
    @Input() public skeletonSize: number = 1;
    @Input() public skeletonWidth: string | undefined;
    @Input() public skeletonHeight: string | undefined;
    @Input() public skeletonClassName: string | undefined;

    constructor(
        private _template: TemplateRef<any>,
        private _viewContainer: ViewContainerRef
    ) { }
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['skeleton']) {
            this._viewContainer.clear();
        }
        
        if (changes['skeleton'].currentValue) {
            Array.from({ length: this.skeletonSize }).forEach(() => {
                const ref: ComponentRef<RectangleComponent> = this._viewContainer.createComponent(RectangleComponent);

                Object.assign(ref.instance, { 
                    width: this.skeletonWidth,
                    height: this.skeletonHeight,
                    className: this.skeletonClassName
                });
            });
        } else {
            this._viewContainer.createEmbeddedView(this._template);
        }
    }

}
