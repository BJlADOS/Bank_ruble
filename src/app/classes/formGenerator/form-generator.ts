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
                    CustomValidators.patternValidator(/[ [!@#$%^&*()_+-=[]/, { hasSpecialCharacters: true }),
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
}
