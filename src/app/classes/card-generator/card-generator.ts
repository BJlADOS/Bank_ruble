import * as moment from 'moment';
import { CardType } from 'src/app/services/firestore/types/card-type';

export class CardGenerator {

    public static generateCardName(type: CardType): string {
        switch(type) {
            case 'MasterCard': 
                return 'MasterCard Mass';
            case 'Visa': 
                return 'Visa Classic';
            case 'Mir':
                return 'Карта Мир';
        }
    }

    public static generateCardNumber(type: CardType): string {
        let number: string = '';
        switch(type) {
            case 'MasterCard': 
                number += '5';
                break;
            case 'Visa': 
                number += '4';
                break;
            case 'Mir':
                number += '2';
                break;
        }
        for (let i: number = 0; i < 15; i++) {
            const num: number = Math.floor(Math.random()*10);
            number += num.toString();      
        }

        return number;
    }

    public static getExpirationDate(): string {
        const date: Date = new Date();
        const momentDate: moment.Moment = moment(date).add(4, 'y');
        const expirationYear: string = momentDate.year().toString().slice(2, 4);
        const month: string = momentDate.month().toString();
        const expirationMonth: string = month.length > 1 ? month: '0' + month;

        return `${expirationMonth}/${expirationYear}`;
    }

    public static getLatinOwnerName(firstName: string, surname: string): string {
        return `${CardGenerator.getLatinName(firstName)} ${CardGenerator.getLatinName(surname)}`;
    }

    public static getRandomCvv(): string {
        let cvv: string = '';
        for (let i: number = 0; i < 3; i++) {
            const num: number = Math.floor(Math.random()*10);
            cvv += num.toString();      
        }

        return cvv;
    }

    private static getLatinName(name: string): string {
        const ru: Map<string, string> = new Map([
            ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'], ['д', 'd'], ['е', 'e'],
            ['є', 'e'], ['ё', 'e'], ['ж', 'j'], ['з', 'z'], ['и', 'i'], ['ї', 'yi'], ['й', 'i'],
            ['к', 'k'], ['л', 'l'], ['м', 'm'], ['н', 'n'], ['о', 'o'], ['п', 'p'], ['р', 'r'],
            ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'], ['х', 'h'], ['ц', 'c'], ['ч', 'ch'],
            ['ш', 'sh'], ['щ', 'shch'], ['ы', 'y'], ['э', 'e'], ['ю', 'u'], ['я', 'ya'],
        ]);
        name = name.replace(/[ъь]+/g, '').toLowerCase();
        let latinName: string = '';
        for (let i: number = 0; i < name.length; i++) {
            latinName += ru.get(name[i])?.toUpperCase();
        }

        return latinName;
    }
}