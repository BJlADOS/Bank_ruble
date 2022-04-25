import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { CustomError } from 'src/app/classes/CustomError/CustomError';
import { FormGenerator } from 'src/app/classes/FormGenerator/form-generator';
import { AuthService } from 'src/app/services/authService/auth.service';
import { State } from 'src/app/shared/types/State';
import { DestroyService } from '../services/destoyService/destroy.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [
        trigger('textAppears', [
            transition('void=>*', [
                style({ opacity: 0 }),
                animate('.5s', style({ opacity: 1 }))
            ])
        ])
    ],
    providers: [
        DestroyService,
    ]
})
export class LoginComponent implements OnInit {
    public state: typeof State = State;
    public redirect: string | undefined;
    public actualState!: State;
    public signUpForm: FormGroup = FormGenerator.getInstance().getSignUpForm();
    public signInForm: FormGroup = FormGenerator.getInstance().getSignInForm();
    public forgotPasswordForm: FormGroup = FormGenerator.getInstance().getForgotPasswordForm();
    public signInError: CustomError = new CustomError('', false);
    public signUpError: CustomError = new CustomError('', false);
    public forgotPasswordError: CustomError = new CustomError('', false);
    public forgotPasswordEmailSent: boolean = false;
    public isSubmitDisabled: boolean = false;

    constructor(
        public route: ActivatedRoute,
        private _auth: AuthService,
        private _router: Router,
        private _destroy$: DestroyService,
    ) {
    }

    public ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this._destroy$)).subscribe((params: Params): void => {
            this.redirect = params['redirectTo'];
            if (params['actualState']) {
                this.updateRoute(params['actualState']);
            } else {
                this.updateRoute(State.signIn);
            }
        });
    }

    public signUp(): void {
        this.switchSubmit();
        const password: string = this.signUpForm.controls['password'].value;
        const email: string = this.signUpForm.controls['email'].value;
        this._auth.register(email, password).then(() => {
            this.switchSubmit();
            this._auth.sendEmailVerification();
            this.signUpError.state = false;
            this._router.navigate(['/account']);
        }).catch((error: Error): void => {
            this.switchSubmit();
            this.signUpError.state = true;
            this.signUpError.message = 'Невозможно зарегистрировать аккаунт на данный email';
        });
    }

    public signIn(): void {
        this.switchSubmit();
        const password: string = this.signInForm.controls['password'].value;
        const email: string = this.signInForm.controls['email'].value;
        this._auth.login(email, password).then(() => {
            this.switchSubmit();
            this.signInError.state = false;
            if (this.redirect) {
                this._router.navigate([this.redirect]);
            } else {
                this._router.navigate(['/account']);
            }
        }).catch((error: Error) => {
            this.switchSubmit();
            this.signInError.state = true;
            if (/user-disabled/.test(error.message)) {
                this.signInError.message = 'Ваш аккаунт заблокирован';
            } else {
                this.signInError.message = 'Неверный email или пароль';
            }
        });
    }

    public forgotPassword(): void {
        this.switchSubmit();
        const email: string = this.forgotPasswordForm.controls['email'].value;
        this._auth.sendPasswordResetEmail(email)
            .then(() => {
                this.switchSubmit();
                this.forgotPasswordError.state = false;
                this.forgotPasswordEmailSent = true;
            })
            .catch((error: Error) => {
                this.switchSubmit();
                this.forgotPasswordError.state = true;
                this.forgotPasswordEmailSent = false;
                this.forgotPasswordError.message = /\d{1}:\d{2}/.test(error.message)? `Подождите ещё ${error.message}` : 'Пользователя с таким email не существует';
            });
    }

    public getBackToSignIn(): void {
        this.updateRoute(State.signIn);
        this.resetForms();
    }

    public toSignUp(): void {
        this.updateRoute(State.signUp);
        this.resetForms();
    }

    public toForgotPassword(): void {
        this.updateRoute(State.forgotPassword);
        this.resetForms();
    }

    private switchSubmit(): void {
        this.isSubmitDisabled = !this.isSubmitDisabled;
    }

    private resetForms(): void {
        this.signInForm.reset();
        this.signUpForm.reset();
        this.forgotPasswordForm.reset();
    }

    
    private updateRoute(state: State): void {
        this.actualState = state;
        this._router.navigate([], {
            relativeTo: this.route,
            queryParams: { actualState: state },
            queryParamsHandling: 'merge'
        });
    }
}
