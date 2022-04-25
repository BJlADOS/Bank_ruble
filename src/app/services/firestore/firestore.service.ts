import { Injectable } from '@angular/core';
import { Auth, updateEmail, updateProfile, User } from '@angular/fire/auth';
import { arrayUnion, doc, DocumentData, DocumentReference, DocumentSnapshot, Firestore, getDoc, onSnapshot, query, runTransaction, setDoc, where } from '@angular/fire/firestore';
import { Functions, FunctionsModule } from '@angular/fire/functions';
import { FormGroup } from '@angular/forms';
import { collection, getDocs, Query, QueryDocumentSnapshot, QuerySnapshot, Transaction, Unsubscribe, updateDoc } from 'firebase/firestore';
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
    private _loadingSubscription!: Subscription;
    private _subsription!: Unsubscribe;
    private _cards$: BehaviorSubject<Array<BehaviorSubject<ICard | null>>> = new BehaviorSubject<Array<BehaviorSubject<ICard | null>>>([]);
    private _cardSubs: Unsubscribe[] = [];

    constructor(
        public fs: Firestore,
        public auth: Auth,
    ) { 
        
    }


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
                if (!this._user$.value && userData) {
                    this.subscribeToCardsChanges(userData.cards);
                } else if (this._user$.value!.defaultCard === userData.defaultCard && !this.isAllcardsBanned()) {
                    this.subscribeToCardsChanges(userData.cards);
                }
                this._user$.next(userData);
                if (this.auth.currentUser?.email !== userData.email) {
                    this.updateEmail(this.auth.currentUser?.email!);
                }
                if (this._user$.value) {
                    this._loadingSubscription = this._cardsLoaded$.asObservable().subscribe((number: number) => {
                        if (number === this._user$.value!.cards.length) {
                            this.isLoaded$.next(true);
                            if (this._loadingSubscription) {
                                this._loadingSubscription.unsubscribe();
                            }
                        }
                    });
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
        updateProfile(this.auth.currentUser, { displayName: firstName });
    }

    public getUserCards(): Observable<Array<BehaviorSubject<ICard | null>>> {
        return this._cards$.asObservable();
    }

    public isCardDefault(card: BehaviorSubject<ICard | null>): boolean {
        return this.findIndexOfCard(card) === this._user$.value?.defaultCard;
    }

    public isCardDefaultById(id: string): boolean {
        return this.isCardDefault(this.findCardSubjectdById(id));
    }

    public isCardBelongsToUser(cardNumber: string): boolean {
        const id: string = parseInt(cardNumber).toString(16);
        for (const card$ of this._cards$.value) {
            if (card$.value?.id === id) {
                return true;
            }
        }

        return false;
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

    public async updateEmail(actualEmail: string): Promise<void> {
        const userRef: DocumentReference<DocumentData> = this.getUserRef();
        await updateDoc(userRef, {
            email: actualEmail
        });
        console.log('email updated');
    }

    //Пересмотреть
    public async getCardExistanceByNumber(cardNumber: string): Promise<boolean> {
        const cardDoc: DocumentReference<DocumentData> = this.getCardReference(cardNumber);
        const cardSnap: DocumentSnapshot<DocumentData> = await getDoc(cardDoc);

        if (cardSnap.exists()) {
            return true;
        }
        throw new Error('Такой карты не существует!');
    }

    public async checkCardNumberForFastSend(cardNumber: string): Promise<boolean> {
        const existance: boolean = await this.getCardExistanceByNumber(cardNumber);
        if (this.isAllcardsBanned() || this._user$.value?.cards.length === 0) {
            throw new Error('У вас нет доступных карт для оплаты');
        }
        if (existance && !this.isCardBelongsToUser(cardNumber)) {
            return true;
        } 
        throw new Error('Карта принадлежит вам, воспользуйтесь переводами между своими счетами');
    }

    public getUserCardById(id: string): Observable<ICard | null> {
        for(const card$ of this._cards$.value) {
            if (id === card$.value?.id) {
                return card$.asObservable();
            }
        }
        throw new Error('Карта не найдена');
    }

    public getDefaultCard(): BehaviorSubject<ICard | null> {
        return this._cards$.value[this._user$.value!.defaultCard];
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
        if (!this.checkUserDataFilled()) {
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
        const cardRef: DocumentReference<DocumentData> = this.getCardReference(card.cardNumber);
        await setDoc(cardRef, card);
        const userRef: DocumentReference<DocumentData> = this.getUserRef();
        updateDoc(userRef, {
            cards: arrayUnion(cardRef)
        });
    }

    public async updateUserDefaultCard(newId: number): Promise<void> {
        const userRef: DocumentReference<DocumentData> = this.getUserRef();
        await updateDoc(userRef, {
            defaultCard: newId
        });
    }

    public setDefaultCardById(id: string): void {
        this.updateUserDefaultCard(this.findIndexOfCard(this.findCardSubjectdById(id)));
    }

    public isAllcardsBanned(): boolean {
        for (const card$ of this._cards$.value) {
            if (!card$.value?.isBanned) {
                return false;
            }
        }

        return true;
    }

    public async banToggleCard(card: ICard): Promise<void> {
        const cardRef: DocumentReference<DocumentData> = this.getCardReference(card.cardNumber);
        if (this.isCardDefaultById(card.id) && !card.isBanned) {
            for (const card$ of this._cards$.value) {
                if (!card$.value?.isBanned && card$.value?.id !== card.id) {
                    await this.updateUserDefaultCard(this.findIndexOfCard(card$));
                    break;
                }
            }
        } else if(card.isBanned && this.isAllcardsBanned()) {
            await this.updateUserDefaultCard(this.findIndexOfCard(this.findCardSubjectdById(card.id)));
        }
        await updateDoc(cardRef, {
            isBanned: !card.isBanned
        });
    }

    public async sendMoney(from: string, to: string, amount: number): Promise<void> {
        console.log(amount);
        const fromRef: DocumentReference<DocumentData> = this.getCardReference(from);
        const toRef: DocumentReference<DocumentData> = this.getCardReference(to);
        try {
            if (!Number.isFinite(amount)) {
                throw 'Некорректная сумма';
            }
            await runTransaction(this.fs, async (transaction: Transaction) => {
                const fromSnap: DocumentSnapshot<DocumentData> = await transaction.get(fromRef);
                const toSnap: DocumentSnapshot<DocumentData> = await transaction.get(toRef);
                if (!toSnap.exists()) {
                    throw 'Такой карты не существует';
                }
                const balanceFrom: number = (fromSnap.data() as ICard).balance;
                if (balanceFrom < amount) {
                    throw 'Недостаточно средств';
                }
                
                const newBalanceFrom: number = parseFloat(((fromSnap.data() as ICard).balance - amount).toFixed(2));
                const newBalanceTo: number = parseFloat(((toSnap.data() as ICard).balance + amount).toFixed(2));
                transaction.update(fromRef, { balance: newBalanceFrom });
                transaction.update(toRef, { balance: newBalanceTo });
            });
            console.log('Транзакция успешно проведена!');
        } catch(e) {
            throw new Error(`Ошибка транзакции: ${e}`);
        }

    }

    public logout(): void {
        this.isLoaded$.next(false);
        this._subsription();
        this.unsubscribeFromCardChanges();
    }

    public init(): void {
        //init method
    }

    public checkUserDataFilled(): boolean {

        if (this._user$.value!.firstName.length === 0) {
            return false;
        }
        if (this._user$.value!.surname.length === 0) {
            return false;
        }
        if (this._user$.value!.secondName.length === 0) {
            return false;
        }
        if (this._user$.value!.passport.length === 0) {
            return false;
        }

        return true;
    }

    private normalizeWord(word: string): string {
        word = word.toLowerCase();

        return `${word[0].toUpperCase()}${word.slice(1)}`;
    }

    private findCardSubjectdById(id: string): BehaviorSubject<ICard | null> {
        for (const card$ of this._cards$.value) {
            if (card$.value?.id === id) {
                return card$;
            }
        }
        throw new Error('карта не найдена');
    }

    private findIndexOfCard(card: BehaviorSubject<ICard | null>): number {
        return this._cards$.value.indexOf(card);
    }

    private getUserRef(): DocumentReference<DocumentData> {
        return doc(this.fs, 'users', this._user$.value!.id);
    }

    private getCardReference(cardNumber: string): DocumentReference<DocumentData> {
        return doc(this.fs, 'cards', cardNumber);
    }
}
