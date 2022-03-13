import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/types/User';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public userData?: User | null;
    constructor(
      public router: Router,
      private _auth: Auth,
      private _firestore: Firestore,
    ) { 
        this._auth.onAuthStateChanged((user: User | null): void => {
            this.userData = user;
        });
    }

    public async login(email: string, password: string): Promise<void> {
        await signInWithEmailAndPassword(this._auth, email, password);
        //this.router.navigate...
    }

    public async register(email: string, password: string): Promise<void> {
        await createUserWithEmailAndPassword(this._auth, email, password);
        this.router.navigate(['/main']); //Fix later
    }

    public async sendEmailVerification(): Promise<void> {
        return await sendEmailVerification(this._auth.currentUser!);
    }

    public async sendPasswordResetEmail(passwordResetEmail: string): Promise<void> {
        return await sendPasswordResetEmail(this._auth, passwordResetEmail);
    }

    public async logout(): Promise<void> {
        await this._auth.signOut();
        localStorage.removeItem('user');
        this.router.navigate(['/main']);
    }

    public get isLoggedIn(): boolean {
        const user: User = localStorage.getItem('user') === null ? null : JSON.parse(localStorage.getItem('user')!);

        return user !== null;
    }
}
