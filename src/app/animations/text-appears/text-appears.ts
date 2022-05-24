import { trigger, transition, style, animate } from '@angular/animations';

export const textAppears: any =
    trigger('textAppears', [
        transition('void=>*', [
            style({ opacity: 0 }),
            animate('.5s', style({ opacity: 1 }))
        ])
    ]);