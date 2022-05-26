import { ErrorHandler, NgModule } from '@angular/core';
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
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from './services/firestore/firestore.service';
import { LoginRUPipe } from './pipes/login-ru/login-ru.pipe';
import { AuthService } from './services/auth/auth.service';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { AlertComponent } from './components/alert/alert.component';
import { DestroyService } from './services/destoy/destroy.service';
import { GlobalErrorHandlerService } from './services/global-error-handler/global-error-handler.service';
import { CommonModule } from '@angular/common';
import { AlertService } from './services/alert/alert.service';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        LoginRUPipe,
        AlertComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        routing,
        provideFirebaseApp(() => initializeApp(environment['firebaseConfig'])),
        provideFirestore(() => getFirestore()),
        StorageModule,
        provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        provideFunctions(() => getFunctions()),
    ],
    providers: [
        FirestoreService,
        AuthService,
        DestroyService,
        GlobalErrorHandlerService,
        { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
        AlertService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
