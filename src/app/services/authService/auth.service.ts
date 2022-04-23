import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import * as moment from 'moment';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable()
export class AuthService {

    public user!: User | null;

    constructor(
        public router: Router,
        private _auth: Auth,
        private _firestore: FirestoreService
    ) {
        this._auth.onIdTokenChanged((user: User | null): void => {
            this.user = user;
            this._firestore.initializeUserFromAuthService(user);
        });
    }

    public async login(email: string, password: string): Promise<void> {
        await signInWithEmailAndPassword(this._auth, email, password);
    }

    public async register(email: string, password: string): Promise<void> {
        await createUserWithEmailAndPassword(this._auth, email, password);
        await this._firestore.createUser(this.user!.uid, email);
    }

    public async sendEmailVerification(): Promise<void> {
        if (localStorage.getItem('sendEmailVerification')) {
            let diff: number = moment(new Date()).diff(moment(new Date(JSON.parse(localStorage.getItem('sendEmailVerification')!))), 'seconds');

            if (diff < 60) {
                diff = 60 - diff;
                const minutes: string = Math.floor(diff / 60).toString();
                const sec: string = (diff % 60).toString();
                const seconds: string = sec.length === 2 ? sec : `0${sec}`;
                throw new Error(`${minutes}:${seconds}`);
            }
        }
        await sendEmailVerification(this._auth.currentUser!);
        localStorage.setItem('sendEmailVerification', JSON.stringify(new Date()));
    }

    public async sendPasswordResetEmail(passwordResetEmail: string): Promise<void> {

        if (localStorage.getItem('resetPassword')) {
            let diff: number = moment(new Date()).diff(moment(new Date(JSON.parse(localStorage.getItem('resetPassword')!))), 'seconds');

            if (diff < 300) {
                diff = 300 - diff;
                const minutes: string = Math.floor(diff / 60).toString();
                const sec: string = (diff % 60).toString();
                const seconds: string = sec.length === 2 ? sec : `0${sec}`;
                throw new Error(`${minutes}:${seconds}`);
            }
        }
        await sendPasswordResetEmail(this._auth, passwordResetEmail);
        localStorage.setItem('resetPassword', JSON.stringify(new Date()));
    }

    public async logout(): Promise<void> {
        await this._auth.signOut();
        this._firestore.logout();
        this.router.navigate(['/main']);
    }

    public get isEmailVerified(): boolean {
        return this._auth.currentUser!.emailVerified;
    } 

    public init(): void {
        //inits service when needed
    }
}
