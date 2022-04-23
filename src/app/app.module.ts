import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { routing } from './app-routing.module';
import { AppComponent } from './app.component';
//Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { StorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
//end
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputCheckDirective } from './Directives/inputCheck/input-check.directive';
import { FirestoreService } from './services/firestore/firestore.service';
import { LoginRUPipe } from './pipes/login-ru/login-ru.pipe';
import { AuthService } from './services/authService/auth.service';
import { AccountProfileComponent } from './account/account-profile/account-profile.component';
import { AccountProfileDataComponent } from './account/account-profile/account-profile-data/account-profile-data.component';
import { AccountProfileEmailComponent } from './account/account-profile/account-profile-email/account-profile-email.component';
import { NgxMaskModule } from 'ngx-mask';
import { AccountCardInfoComponent } from './account/account-card-info/account-card-info.component';
import { CardNumberPipe } from './pipes/card-number/card-number.pipe';
import { CvvPipe } from './pipes/cvv/cvv.pipe';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        InputCheckDirective,
        LoginRUPipe,
    ],
    imports: [
        BrowserModule,
        routing,
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideFirestore(() => getFirestore()),
        StorageModule,
        provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),
        ReactiveFormsModule,
        BrowserAnimationsModule,
    ],
    providers: [
        FirestoreService,
        AuthService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
