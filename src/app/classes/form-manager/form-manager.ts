import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ICard } from 'src/app/services/firestore/interfaces/Card';

export class FormManager {
    private static _formGenerator: FormManager;

    public static getInstance(): FormManager {
        if (FormManager._formGenerator) {
            return FormManager._formGenerator;
        }
        FormManager._formGenerator = new FormManager();

        return FormManager._formGenerator;
    }

    public updateUserForm(form: FormGroup, firstName: string, surname: string, secondName: string, passport: string): void {
        form.get('firstName')?.patchValue(firstName);
        form.get('surname')?.patchValue(surname);
        form.get('secondName')?.patchValue(secondName);
        form.get('passport')?.patchValue(passport);
    }

    public updateEmailForm(form: FormGroup, email: string): void {
        form.get('email')?.patchValue(email);
    }

    public updateSendMoneyToCardForm(form: FormGroup, cardNumber: string): void {
        form.get('cardNumber')?.patchValue(cardNumber);
    }

    public updateMoneyInMoneyAmountForm(form:FormGroup, amount: number | null): void { 
        form.get('amount')?.patchValue(amount);  
    }

    public updateCardInMoneyAmountForm(form:FormGroup, card$: BehaviorSubject<ICard | null>): void {
        form.get('card')?.patchValue(card$);  
    }

    public updateCardsInSendSelfForm(form:FormGroup, cardFrom$: BehaviorSubject<ICard | null>): void {
        form.get('cardFrom')?.patchValue(cardFrom$);  
    }

    public updateMoneyInSendSelfForm(form:FormGroup, amount: number | null): void { 
        form.get('amount')?.patchValue(amount);  
    }
}
