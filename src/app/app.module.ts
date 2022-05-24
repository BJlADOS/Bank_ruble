import { ErrorHandler, NgModule, Renderer2 } from '@angular/core';
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
import { InputCheckDirective } from './Directives/inputCheck/input-check.directive';
import { FirestoreService } from './services/firestore/firestore.service';
import { LoginRUPipe } from './pipes/login-ru/login-ru.pipe';
import { AuthService } from './services/authService/auth.service';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { AccountSendSelfComponent } from './account/components/account-send-self/account-send-self.component';
import { ModalDeleteCardComponent } from './account/components/modal-delete-card/modal-delete-card.component';
import { ModalContainerComponent } from './components/modal-container/modal-container.component';
import { CardHistoryItemComponent } from './account/components/card-history-item/card-history-item.component';
import { AlertComponent } from './components/alert/alert.component';
import { DestroyService } from './services/destoyService/destroy.service';
import { GlobalErrorHandlerService } from './services/global-error-handler/global-error-handler.service';
import { RectangleComponent } from './components/rectangle/rectangle.component';
import { SkeletonDirective } from './Directives/skeleton/skeleton.directive';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        InputCheckDirective,
        LoginRUPipe,
        AlertComponent,
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
        provideFunctions(() => getFunctions()),
    ],
    providers: [
        FirestoreService,
        AuthService,
        DestroyService,
        GlobalErrorHandlerService,
        { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
