import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public user!: User | null;

    constructor(
      public router: Router,
      private _auth: Auth,
      private _firestore: Firestore,
    ) { 
        this._auth.onAuthStateChanged((user: User | null): void => {
            this.user = user;
        });
    }

    public async login(email: string, password: string): Promise<void> {
        await signInWithEmailAndPassword(this._auth, email, password);
    }

    public async register(email: string, password: string): Promise<void> {
        await createUserWithEmailAndPassword(this._auth, email, password);
    }

    public async sendEmailVerification(): Promise<void> {
        return await sendEmailVerification(this._auth.currentUser!);
    }

    public async sendPasswordResetEmail(passwordResetEmail: string): Promise<void> {
        
        if (localStorage.getItem('resetPassword')) {
            let diff: number = moment(new Date()).diff(moment(new Date(JSON.parse(localStorage.getItem('resetPassword')!))), 'seconds');
            
            if (diff < 300) {
                diff = 300 - diff;
                const minutes: string = Math.floor(diff / 60).toString();
                const sec: string = (diff % 60).toString();
                const seconds: string = sec.length === 2 ? sec: `0${sec}`;
                throw new Error(`${minutes}:${seconds}`);
            }
        }
        const result: void = await sendPasswordResetEmail(this._auth, passwordResetEmail);
        localStorage.setItem('resetPassword', JSON.stringify(new Date()));
        
        return result;
    }

    public async logout(): Promise<void> {
        await this._auth.signOut();
        this.router.navigate(['/main']);
    }

    public get isLoggedIn(): boolean { //unused
        return this._auth.currentUser !== null;
    }
}
