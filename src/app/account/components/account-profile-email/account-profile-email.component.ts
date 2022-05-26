import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { filter, takeUntil } from 'rxjs';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { FormManager } from 'src/app/classes/form-manager/form-manager';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DestroyService } from 'src/app/services/destoy/destroy.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { IUser } from 'src/app/services/firestore/interfaces/User';

@Component({
    selector: 'app-account-profile-email',
    templateUrl: './account-profile-email.component.html',
    styleUrls: ['./account-profile-email.component.scss'],
    animations: [
        contentExpansion
    ]
})
export class AccountProfileEmailComponent implements OnInit {

    public emailForm: FormGroup = FormGenerator.getInstance().getEmptyEmailForm();
    public user!: IUser;
    public isEmailFormDisabled: boolean = true;
    public isSubmitDisabled: boolean = false;
    public isEmailFormEdited: boolean = false;
    public emailVerificationStatus: string = '';
    public isEmailVerified: boolean = false;

    constructor(
        public fs: FirestoreService,
        public destroy$: DestroyService,
        public auth: AuthService,
        public alert: AlertService,
    ) { }

    public ngOnInit(): void {
        this.fs.getUser().pipe(filter((user: IUser | null) => user !== null), takeUntil(this.destroy$)).subscribe((user: IUser | null): void => {
            this.user = user!;
            FormManager.getInstance().updateEmailForm(this.emailForm, user!.email);
            this.isEmailVerified = this.auth.isEmailVerified;
        });
    }

    public editEmail(): void {
        this.isEmailFormEdited = false;
        this.isEmailFormDisabled = false;
    }

    public submitEmailEdit(): void {
        console.log('submitted');
        this.isSubmitDisabled = true;
        this.fs.editEmail(this.emailForm.get('email')!.value).then(() => {
            this.isEmailFormDisabled = true;
            this.isSubmitDisabled = false;
            this.isEmailFormEdited = true;
        }).catch((error: Error) => {
            this.isSubmitDisabled = false;
            this.alert.error(this.parseError(error.message));
        });
    }

    public sendEmailVerification(): void {
        this.auth.sendEmailVerification().then(() => {
            this.isEmailFormEdited = true;
        }).catch((error: Error) => {
            this.isEmailFormEdited = false;
            this.alert.error(this.parseError(error.message));
        });
    }

    public cancel(): void {
        FormManager.getInstance().updateEmailForm(this.emailForm, this.user.email);;
        this.isEmailFormDisabled = true;
    }

    private parseError(errorMessage: string): string {

        if (/already/.test(errorMessage))  {
            return 'Данный email занят!';
        }
        if (/\d{1}:\d{2}/.test(errorMessage)) {
            return `Подождите ещё ${errorMessage}`;
        }
        if (/текущий/.test(errorMessage)) {
            return 'Вы ввели свой текущий email!';
        }
        
        return 'Неизвестная ошибка, попробуйте снова';
    }
}
