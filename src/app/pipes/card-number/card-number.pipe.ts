import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cardNumber'
})
export class CardNumberPipe implements PipeTransform {

    public transform(cardNumber: string, hide: boolean): string {

        return hide? `** ${cardNumber.slice(12, 16)}` : `${cardNumber.slice(0, 4)} ${cardNumber.slice(4, 8)} ${cardNumber.slice(8, 12)} ${cardNumber.slice(12, 16)}`;
    }

}
