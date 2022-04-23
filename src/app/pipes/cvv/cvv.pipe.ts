import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cvv'
})
export class CvvPipe implements PipeTransform {

    public transform(cvv: string, hidden: boolean): string {

        return hidden ? '***' : cvv;
    }

}
