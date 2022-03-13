import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { filter } from 'rxjs';
import { FormGenerator } from 'src/app/classes/formGenerator/form-generator';
import { AuthService } from 'src/app/services/authService/auth.service';
import { State } from 'src/app/shared/types/State';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public actualState!: State;
    public signUpForm: FormGroup = FormGenerator.getInstance().getSignUpForm();
    public signInForm: FormGroup = FormGenerator.getInstance().getSignInForm();

    constructor(
      public route: ActivatedRoute,
      private _auth: AuthService
    ) { 
    }

    public ngOnInit(): void {
        this.route.queryParams.pipe(filter((params: Params) => params['actualState'])).subscribe((params: Params): void => {
            this.actualState = params['actualState'];
        });
    }

    public signUp(): void {
        const password: string = this.signUpForm.controls['password'].value;
        const email: string = this.signUpForm.controls['email'].value;
        this._auth.register(email, password).then(() => {
            this._auth.sendEmailVerification();
        }).catch((error: Error): void => {
            window.alert(error.message);
        });
    }

    public signIn(): void {
        const password: string = this.signInForm.controls['password'].value;
        const email: string = this.signInForm.controls['email'].value;
        this._auth.login(email, password).then(() => {
            window.alert('povezlo');
        }).catch((error: Error) => {
            window.alert('Неверный email или пароль');
        });
    }
}
