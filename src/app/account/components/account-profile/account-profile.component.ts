import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { filter, takeUntil } from 'rxjs';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { FormManager } from 'src/app/classes/form-manager/form-manager';
import { FormGenerator } from 'src/app/classes/FormGenerator/form-generator';
import { DestroyService } from 'src/app/services/destoyService/destroy.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { IUser } from 'src/app/services/firestore/interfaces/User';

@Component({
    selector: 'app-account-profile',
    templateUrl: './account-profile.component.html',
    styleUrls: ['./account-profile.component.scss'],
    animations: [
        contentExpansion
    ]
})
export class AccountProfileComponent implements OnInit {

    public userForm: FormGroup = FormGenerator.getInstance().getEmptyUserForm();
    public user!: IUser;
    public isUserDataFormDisabled: boolean = true;
    public isSubmitDisabled: boolean = false;
    public isUserDataEdited: boolean = false;
    public isError: boolean = false;
    public errorMessage: string = '';

    constructor(
        public fs: FirestoreService,
        public destory$: DestroyService,
    ) { }

    public ngOnInit(): void {
        this.fs.getUser().pipe(filter((user: IUser | null) => user !== null), takeUntil(this.destory$)).subscribe((user: IUser | null): void => {
            this.user = user!;
            FormManager.getInstance().updateUserForm(this.userForm, user!.firstName, user!.surname, user!.secondName, user!.passport);
        });
    }

    public submitUserData(): void {
        console.log('submitted');
        this.isSubmitDisabled = true;
        this.fs.updateUserData(this.userForm).then(() => {
            this.isError = false;
            this.isUserDataFormDisabled = true;
            this.isSubmitDisabled = false;
            this.isUserDataEdited = true;
        }).catch((er: Error) => {
            this.isError = true;
            this.isSubmitDisabled = false;
            this.errorMessage = er.message;
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
