import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { filter, takeUntil } from 'rxjs';
import { FormManager } from 'src/app/classes/form-manager/form-manager';
import { FormGenerator } from 'src/app/classes/FormGenerator/form-generator';
import { AlertService } from 'src/app/services/alert/alert.service';
import { DestroyService } from 'src/app/services/destoyService/destroy.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { IUser } from 'src/app/services/firestore/interfaces/User';

@Component({
    selector: 'app-account-profile-data',
    templateUrl: './account-profile-data.component.html',
    styleUrls: ['./account-profile-data.component.scss'],
    animations: [
        trigger('contentExpansion', [
            state('expanded', style({ height: '*', opacity: 1, visibility: 'visible' })),
            state('collapsed', style({ height: '0', opacity: 0, visibility: 'hidden', padding: 0 })),
            transition('expanded <=> collapsed',
                animate('300ms cubic-bezier(.37,1.04,.68,.98)')),
        ])
    ]
})
export class AccountProfileDataComponent implements OnInit {
    public userForm: FormGroup = FormGenerator.getInstance().getEmptyUserForm();
    public user!: IUser;
    public isUserDataFormDisabled: boolean = true;
    public isSubmitDisabled: boolean = false;
    public isUserDataEdited: boolean = false;
    public isError: boolean = false;
    public errorMessage: string = '';

    constructor(
        public fs: FirestoreService,
        public destroy$: DestroyService,
        public alert: AlertService,
    ) { }

    public ngOnInit(): void {
        this.fs.getUser().pipe(filter((user: IUser | null) => user !== null), takeUntil(this.destroy$)).subscribe((user: IUser | null): void => {
            this.user = user!;
            FormManager.getInstance().updateUserForm(this.userForm, user!.firstName, user!.surname, user!.secondName, user!.passport);
        });
    }

    public submitUserData(): void {
        this.isSubmitDisabled = true;
        this.fs.updateUserData(this.userForm).then(() => {
            this.isError = false;
            this.isUserDataFormDisabled = true;
            this.isSubmitDisabled = false;
            this.alert.success('Сохранено!');
        }).catch((er: Error) => {
            this.isError = true;
            this.isSubmitDisabled = false;
            this.alert.error(er.message);
        });

    }

    public editUserData(): void {
        this.isUserDataEdited = false;
        this.isUserDataFormDisabled = false;
    }

    public cancel(): void {
        this.isError = false;
        FormManager.getInstance().updateUserForm(this.userForm, this.user.firstName, this.user.surname, this.user.secondName, this.user.passport);;
        this.isUserDataFormDisabled = true;
    }
}
