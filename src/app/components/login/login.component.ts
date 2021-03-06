import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { AuthService } from 'src/app/services/auth/auth.service';
import { State } from 'src/app/shared/types/State';
import { AlertService } from '../../services/alert/alert.service';
import { DestroyService } from '../../services/destoy/destroy.service';

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
    public forgotPasswordEmailSent: boolean = false;
    public isSubmitDisabled: boolean = false;

    constructor(
        public route: ActivatedRoute,
        public alert: AlertService,
        private _auth: AuthService,
        private _router: Router,
        private _destroy$: DestroyService,
    ) {
        if (_router.getCurrentNavigation()?.extras.state) {
            this.redirect = _router.getCurrentNavigation()?.extras.state!['redirectTo'];
        }
    }

    public ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this._destroy$)).subscribe((params: Params): void => {
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
            this._router.navigate(['/account']);
        }).catch(() => {
            this.switchSubmit();
            this.alert.error('???????????????????? ???????????????????????????????? ?????????????? ???? ???????????? email');
        });
    }

    public signIn(): void {
        this.switchSubmit();
        const password: string = this.signInForm.controls['password'].value;
        const email: string = this.signInForm.controls['email'].value;
        this._auth.login(email, password).then(() => {
            this.switchSubmit();
            if (this.redirect) {
                this._router.navigate([this.redirect]);
            } else {
                this._router.navigate(['/account']);
            }
        }).catch((error: Error) => {
            this.switchSubmit();
            if (/user-disabled/.test(error.message)) {
                this.alert.error('?????? ?????????????? ????????????????????????');
            } else {
                this.alert.error('???????????????? email ?????? ????????????');
            }
        });
    }

    public forgotPassword(): void {
        this.switchSubmit();
        const email: string = this.forgotPasswordForm.controls['email'].value;
        this._auth.sendPasswordResetEmail(email)
            .then(() => {
                this.switchSubmit();
                this.forgotPasswordEmailSent = true;
            })
            .catch((error: Error) => {
                this.switchSubmit();
                this.forgotPasswordEmailSent = false;
                this.alert.error(/\d{1}:\d{2}/.test(error.message)? `?????????????????? ?????? ${error.message}` : '???????????????????????? ?? ?????????? email ???? ????????????????????');
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
