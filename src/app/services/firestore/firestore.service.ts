import { Injectable } from '@angular/core';
import { Auth, updateEmail, User } from '@angular/fire/auth';
import { arrayUnion, doc, DocumentData, DocumentReference, DocumentSnapshot, Firestore, getDoc, onSnapshot, query, setDoc, where } from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { collection, getDocs, Query, QueryDocumentSnapshot, QuerySnapshot, Unsubscribe, updateDoc } from 'firebase/firestore';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CardGenerator } from 'src/app/classes/card-generator/card-generator';
import { ICard } from './interfaces/Card';
import { IUser } from './interfaces/User';
import { CardType } from './types/card-type';

@Injectable()
export class FirestoreService {

    public isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private _cardsLoaded$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private _user$: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);
    private _loadingSubscription: Subscription = this._cardsLoaded$.asObservable().subscribe((number: number) => {
        if (this._user$.value && number === this._user$.value!.cards.length) {
            this.isLoaded$.next(true);
            this._loadingSubscription.unsubscribe();
        }
    });
    private _subsription!: Unsubscribe;
    private _cards$: BehaviorSubject<Array<BehaviorSubject<ICard | null>>> = new BehaviorSubject<Array<BehaviorSubject<ICard | null>>>([]);
    private _cardSubs: Unsubscribe[] = [];

    constructor(
        public fs: Firestore,
        public auth: Auth,
    ) { }


    public async createUser(id: string, email: string): Promise<void> {
        await setDoc(doc(this.fs, 'users', id), {
            id: id,
            email: email,
            firstName: '',
            surname: '',
            secondName: '',
            passport: '',
            defaultCard: 0,
            cards: []
        });
    }

    public getUser(): Observable<IUser | null> {
        return this._user$.asObservable();
    }

    public initializeUserFromAuthService(userToken: User | null): void {
        if (userToken) {
            this.subscribeToUserChanges(userToken.uid);
        } else {
            this._user$.next(null);;
        }
    }

    public subscribeToUserChanges(id: string): void {
        this._subsription = onSnapshot(doc(this.fs, 'users', id), { includeMetadataChanges: true }, (user: DocumentSnapshot<DocumentData>) => {
            if (!user.metadata.hasPendingWrites) {
                const userData: IUser = user.data() as IUser;
                this._user$.next(userData);
                this.subscribeToCardsChanges(userData.cards);
                if (this.auth.currentUser?.email !== userData.email) {
                    this.updateEmail(userData, this.auth.currentUser?.email!);
                }
            }
        });
    }

    public async updateUserData(form: FormGroup): Promise<void> {
        if (!this.auth.currentUser?.emailVerified) {
            throw new Error('Сначала подтвердите свой email!');
        }
        const userRef: DocumentReference<DocumentData> = doc(this.fs, 'users', this._user$.value!.id);

        const firstName: string = this.normalizeWord(form.get('firstName')!.value);
        const surname: string = this.normalizeWord(form.get('surname')!.value);
        const secondName: string = this.normalizeWord(form.get('secondName')!.value);
        const passport: string = form.get('passport')!.value;
        await updateDoc(userRef, {
            firstName: firstName,
            surname: surname,
            secondName: secondName,
            passport: passport,
        });
    }

    public getUserCards(): Observable<Array<BehaviorSubject<ICard | null>>> {
        return this._cards$.asObservable();
    }

    public subscribeToCardsChanges(cards: Array<DocumentReference<DocumentData>>): void {
        this.unsubscribeFromCardChanges();
        const cardsToObs: Array<BehaviorSubject<ICard | null>> = [];
        for (const cardref of cards) {
            const cardSubject: BehaviorSubject<ICard | null> = new BehaviorSubject<ICard | null>(null);
            this._cardSubs.push(onSnapshot(cardref, { includeMetadataChanges: true }, (card: DocumentSnapshot<DocumentData>) => {
                if (!card.metadata.hasPendingWrites) {
                    if (!cardSubject.value) {
                        this._cardsLoaded$.next(this._cardsLoaded$.value + 1);
                    }          
                    cardSubject.next(card.data() as ICard);
                }
            }));
            cardsToObs.push(cardSubject);
        }
        this._cards$.next(cardsToObs);
    }

    public unsubscribeFromCardChanges(): void {
        for(const sub of this._cardSubs) {
            sub();
        }
    }

    public async updateEmail(user: IUser, actualEmail: string): Promise<void> {
        const userRef: DocumentReference<DocumentData> = doc(this.fs, 'users', user.id);
        await updateDoc(userRef, {
            email: actualEmail
        });
        console.log('email updated');
    }



    public async getCardByNumber(cardNumber: string): Promise<ICard> {
        const cardDoc: DocumentReference<DocumentData> = this.getCardReference(cardNumber);
        const cardSnap: DocumentSnapshot<DocumentData> = await getDoc(cardDoc);

        if (cardSnap.data()) {
            return cardSnap.data() as ICard;
        } else {
            throw new Error('Такой карты не существует!');
        }
    }

    public getCardById(id: string): Observable<ICard | null> {
        for(const card$ of this._cards$.value) {
            if (id === card$.value?.id) {
                return card$.asObservable();
            }
        }
        throw new Error('Карта не найдена');
    }

    public async editEmail(newEmail: string): Promise<void> {
        if (newEmail === this._user$.value?.email) {
            throw new Error('Вы ввели свой текущий email!');
        }
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
        await updateEmail(this.auth.currentUser!, newEmail);
        localStorage.setItem('sendEmailVerification', JSON.stringify(new Date())); 
    }

    public async findCardOwner(cardNumber: string): Promise<IUser> {
        let user: IUser;
        const cardDoc: DocumentReference<DocumentData> = this.getCardReference(cardNumber);

        const userQuery: Query<DocumentData> = query(collection(this.fs, 'users'), where('cards', 'array-contains', cardDoc));
        const userQuerySnap: QuerySnapshot<DocumentData> = await getDocs(userQuery);
        userQuerySnap.forEach((userSnap: QueryDocumentSnapshot<DocumentData>) => {
            user = userSnap.data() as IUser;
        });

        return user!;
    }

    public async createCard(type: CardType): Promise<void> {
        const user: IUser = this._user$.value!;
        if (!this.auth.currentUser?.emailVerified) {
            throw new Error('Сначала подтвердите свой email!');
        }
        if (!this.checkUserForCardCreation(user)) {
            throw new Error('Для создания карты данные пользователя должны быть заполнены!');
        }
        let isValid: boolean = false;
        let cardNumber: string = '';
        while (!isValid) {
            cardNumber = CardGenerator.generateCardNumber(type);
            const cardsQuery: Query<DocumentData> = query(collection(this.fs, 'cards'), where('cardNumber', '==', cardNumber));
            const cardsQuerySnap: QuerySnapshot<DocumentData> = await getDocs(cardsQuery);
            if (cardsQuerySnap.empty) {
                isValid = true;
            }
        }
        const cardId: string = parseInt(cardNumber).toString(16);
        const card: ICard = {
            cardNumber: cardNumber,
            expirationDate: CardGenerator.getExpirationDate(),
            owner: CardGenerator.getLatinOwnerName(user.firstName, user.surname),
            cvv: CardGenerator.getRandomCvv(),
            name: CardGenerator.generateCardName(type),
            balance: 0,
            isBanned: false,
            id: cardId
        };
        const cardRef: DocumentReference<DocumentData> = doc(this.fs, 'cards', card.cardNumber);
        await setDoc(cardRef, card);
        const userRef: DocumentReference<DocumentData> = doc(this.fs, 'users', this._user$.value!.id);
        updateDoc(userRef, {
            cards: arrayUnion(cardRef)
        });
    }

    public async banToggleCard(card: ICard): Promise<void> {
        const cardRef: DocumentReference<DocumentData> = doc(this.fs, 'cards', card.cardNumber);
        await updateDoc(cardRef, {
            isBanned: !card.isBanned
        });
    }

    public logout(): void {
        this._subsription();
        this.unsubscribeFromCardChanges();
    }

    public init(): void {
        //init method
    }

    private checkUserForCardCreation(user: IUser): boolean {

        if (user.firstName.length === 0) {
            return false;
        }
        if (user.surname.length === 0) {
            return false;
        }
        if (user.secondName.length === 0) {
            return false;
        }
        if (user.passport.length === 0) {
            return false;
        }

        return true;
    }

    private normalizeWord(word: string): string {
        word = word.toLowerCase();

        return `${word[0].toUpperCase()}${word.slice(1)}`;
    }

    private getCardReference(cardNumber: string): DocumentReference<DocumentData> {
        return doc(this.fs, 'cards', cardNumber);
    }
}
