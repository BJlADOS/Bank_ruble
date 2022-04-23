import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../CustomValidators/custom-validators';

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

    public updateUserForm(form: FormGroup, firstName: string, surname: string, secondName: string, passport: string): void {
        form.get('firstName')?.patchValue(firstName);
        form.get('surname')?.patchValue(surname);
        form.get('secondName')?.patchValue(secondName);
        form.get('passport')?.patchValue(passport);
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

    public updateEmailForm(form: FormGroup, email: string): void {
        form.get('email')?.patchValue(email);
    }
}
