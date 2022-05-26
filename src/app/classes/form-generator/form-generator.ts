import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, interval } from 'rxjs';
import { ICard } from 'src/app/services/firestore/interfaces/Card';
import { CustomValidators } from '../custom-validators/custom-validators';

export class FormGenerator {
    private static _formGenerator: FormGenerator;

    public static getInstance(): FormGenerator {
        if (FormGenerator._formGenerator) {
            return FormGenerator._formGenerator;
        }
        FormGenerator._formGenerator = new FormGenerator();

        return FormGenerator._formGenerator;
    }

    private _fb: FormBuilder;

    private constructor() { 
        this._fb = new FormBuilder();
    }

    public getSignUpForm(): FormGroup {
        return this._fb.group(        
            {   
                email: [null, Validators.compose([
                    Validators.email, 
                    Validators.required,
                ])],
                password: [null, Validators.compose([
                    Validators.required,
                    CustomValidators.patternValidator(/\d/, { hasNumber: true }),
                    CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
                    CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
                    CustomValidators.patternValidator(/[!@#$%^&*()_+/\-=[\]]+/, { hasSpecialCharacters: true }),
                    Validators.minLength(8)
                ])],
                confirmPassword: [null, Validators.compose([Validators.required])]
            }, 
            {
                validators: CustomValidators.passwordMatchValidator
            }
        );
    }

    public getSignInForm(): FormGroup {
        return this._fb.group(        
            {   
                email: [null, Validators.compose([
                    Validators.email, 
                    Validators.required,
                ])],
                password: [null, Validators.compose([
                    Validators.required
                ])],
            }
        );
    }

    public getForgotPasswordForm(): FormGroup {
        return this._fb.group(        
            {   
                email: [null, Validators.compose([
                    Validators.email, 
                    Validators.required,
                ])],
            }
        );
    }

    public getEmptyUserForm(): FormGroup {
        return this._fb.group(        
            {   
                firstName: [null, Validators.compose([ 
                    Validators.required,
                    CustomValidators.patternValidator(/^([а-яА-Яё]+)$/, { shouldBeOnlyRussian: true }),
                ])],
                surname: [null, Validators.compose([ 
                    Validators.required,
                    CustomValidators.patternValidator(/^([а-яА-Яё]+)$/, { shouldBeOnlyRussian: true }),
                ])],
                secondName: [null, Validators.compose([ 
                    Validators.required,
                    CustomValidators.patternValidator(/^([а-яА-Яё]+)$/, { shouldBeOnlyRussian: true }),
                ])],
                passport: [null, Validators.compose([ 
                    Validators.required,
                    Validators.minLength(10),
                    CustomValidators.patternValidator(/^([\d]+)$/, { shouldBeDigits: true }),
                ])],
            } 
        );
    }

    public getEmptyEmailForm(): FormGroup {
        return this._fb.group(        
            {   
                email: [null, Validators.compose([ 
                    Validators.required,
                    Validators.email,
                ])]
            } 
        );
    }

    public getSendMoneyToCardForm(): FormGroup {
        return this._fb.group(        
            {   
                cardNumber: ['', Validators.compose([ 
                    Validators.required,
                    Validators.minLength(16),
                    CustomValidators.patternValidator(/^[245]/, { shouldHaveKnownDigits: true }),
                ])]
            } 
        );
    }

    public getMoneyAmountForm(): FormGroup {
        return this._fb.group(        
            {   
                card: [null],
                amount: [null, Validators.compose([ 
                    Validators.required,
                ])]
            } 
        );
    }

    public getSendSelfForm(): FormGroup {
        return this._fb.group(        
            {   
                cardFrom: [null],
                cardTo: [null, Validators.compose([ 
                    Validators.required,
                ])],
                amount: [null, Validators.compose([ 
                    Validators.required,
                ])]
            } 
        );
    }
}
