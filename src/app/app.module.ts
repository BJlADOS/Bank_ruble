import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//Firebase
import { provideFirebaseApp, initializeApp, FirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { StorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
//end
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './main/main.component';
import { AuthService } from './services/authService/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { InputCheckDirective } from './Directives/inputCheck/input-check.directive';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainComponent,
        InputCheckDirective,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideFirestore(() => getFirestore()),
        StorageModule,
        provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),
        ReactiveFormsModule,
    ],
    providers: [
        AuthService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
