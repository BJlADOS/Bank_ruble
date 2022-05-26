import { Injectable } from '@angular/core';
import { Auth, updateEmail, updateProfile, User } from '@angular/fire/auth';
import { addDoc, arrayRemove, arrayUnion, deleteDoc, doc, DocumentData, DocumentReference, DocumentSnapshot, Firestore, getDoc, onSnapshot, query, runTransaction, setDoc, where } from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { collection, getDocs, Query, QueryDocumentSnapshot, QuerySnapshot, Timestamp, Transaction, Unsubscribe, updateDoc } from 'firebase/firestore';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CardGenerator } from 'src/app/classes/card-generator/card-generator';
import { ICard } from './interfaces/Card';
import { IDeletedCard } from './interfaces/deleted-card';
import { ITransaction, ITransactionTarget, TransactionType } from './interfaces/transaction';
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
    private _historySub!: Unsubscribe;

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
                if (!this._user$.value && userData) {
                    this.subscribeToCardsChanges(userData.cards);
                } else if (this._user$.value!.defaultCard === userData.defaultCard && !this.isAllcardsBanned()) {
                    this.subscribeToCardsChanges(userData.cards);
                } else if (this._user$.value!.cards.length !== userData.cards.length) {
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
        const userRef: DocumentReference<DocumentData> = this.getUserRef();

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
        this.unsubFromHistory(); 
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
            if ((cardSnap.data() as ICard).isBanned) {
                throw new Error('Эта карта заблокирована');
            }

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
        throw new Error('Карта не найдена!');
    }

    public getDefaultCard(): BehaviorSubject<ICard | null> {
        if (this._cards$.value[this._user$.value!.defaultCard]) {
            return this._cards$.value[this._user$.value!.defaultCard];
        }
        throw new Error('У вас нету доступных карт!');
    }

    public getNumberOfBannedCards(): number {
        let banned: number = 0;
        for (const card$ of this._cards$.value) {
            if (card$.value?.isBanned) {
                banned++;
            }
        }
        
        return banned;
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

    public async setDefaultCardById(id: string): Promise<void> {
        await this.updateUserDefaultCard(this.findIndexOfCard(this.findCardSubjectdById(id)));
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
                    await this.setDefaultCardById(card$.value!.id);
                    break;
                }
            }
        } else if(card.isBanned && this.isAllcardsBanned()) {
            await this.setDefaultCardById(card.id);
        }
        await updateDoc(cardRef, {
            isBanned: !card.isBanned
        });
    }

    public async sendMoney(from: string, to: string, amount: number, type: TransactionType): Promise<void> {
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
                const fromCard: ICard = fromSnap.data() as ICard;
                const toCard: ICard = toSnap.data() as ICard;
                const balanceFrom: number = fromCard.balance;
                if (balanceFrom < amount) {
                    throw 'Недостаточно средств';
                }
                await this.addTransactionToHistory(toCard, fromCard, amount, type);

                const newBalanceFrom: number = parseFloat((fromCard.balance - amount).toFixed(2));
                const newBalanceTo: number = parseFloat((toCard.balance + amount).toFixed(2));
                transaction.update(fromRef, { balance: newBalanceFrom });
                transaction.update(toRef, { balance: newBalanceTo });
            });
        } catch(e) {
            throw new Error(`Ошибка транзакции: ${e}`);
        }

    }

    public async deleteCard(cardNumber: string, id: string): Promise<void> {
        const cardRef: DocumentReference<DocumentData> = this.getCardReference(cardNumber);
        const userRef: DocumentReference<DocumentData> = this.getUserRef();
        const card: ICard = this.findCardSubjectdById(id).value!;
        await updateDoc(userRef, {
            cards: arrayRemove(cardRef)
        });
        if (card.balance > 0) {
            const deletedCard: IDeletedCard = {
                cardNumber: card.cardNumber,
                expirationDate: card.expirationDate,
                owner: card.owner,
                cvv: card.cvv,
                name: card.name,
                balance: card.balance,
                id: card.id,
                ownerPassport: this._user$.value!.passport
            };
            await setDoc(doc(this.fs, 'deleted cards', cardNumber), deletedCard);
        }
        await deleteDoc(cardRef);
    }

    public getCardHistory(cardId: string): Observable<Array<DocumentReference<DocumentData>>> {
        this.unsubFromHistory();
        const card: BehaviorSubject<ICard | null> = this.findCardSubjectdById(cardId);
        const cardHistory: DocumentReference<DocumentData> = doc(this.fs, 'cards history', card.value!.cardNumber);
        const history: BehaviorSubject<Array<DocumentReference<DocumentData>>> = new BehaviorSubject<Array<DocumentReference<DocumentData>>>([]);
        this._historySub = onSnapshot(cardHistory, { includeMetadataChanges: true }, (cardHist: DocumentSnapshot<DocumentData>) => {
            if (cardHist.exists()) {
                history.next((cardHist.data()!['transactions'] as Array<DocumentReference<DocumentData>>).reverse());
            }                 
        });

        return history.asObservable();
    }

    public async loadTransactions(history: Array<DocumentReference<DocumentData>>, numberOfLoadedTransactions: number, step: number): Promise<ITransaction[]> {
        const transactions: ITransaction[] = [];
        const endIndex: number = numberOfLoadedTransactions + step > history.length ? history.length: numberOfLoadedTransactions + step; 
        const historySlice: Array<DocumentReference<DocumentData>> = history.slice(numberOfLoadedTransactions, endIndex);
        for (const transaction of historySlice) {
            const transactSnap: DocumentSnapshot<DocumentData> = await getDoc(transaction);
            transactions.push(transactSnap.data() as ITransaction);
        }

        return transactions;
    }

    public unsubFromHistory(): void {
        if (this._historySub) {
            this._historySub();
        }  
    }

    public async getTransactionTarget(targetNumber: string, type: TransactionType): Promise<ITransactionTarget> {
        let icon: string = '';
        switch(type) {
            case TransactionType.self: 
                icon = 'assets/img/transaction-self.svg';
                break;
            case TransactionType.to:
                icon = 'assets/img/transaction.svg';
                break;
        }
        if (type === TransactionType.self || type === TransactionType.to) {
            const card: ICard = (await getDoc(this.getCardReference(targetNumber))).data() as ICard;
            let name: string = card.name;
            if (type === TransactionType.to) {
                const user: IUser = await this.findCardOwner(targetNumber);
                name += ` (${user.surname} ${user.firstName} ${user.secondName})`;
            }

            return {
                name: name,
                number: card.cardNumber,
                icon: icon,
            };
        }
        throw new Error('Услуги ещё не добавлены');
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

    public findCardSubjectdById(id: string): BehaviorSubject<ICard | null> {
        for (const card$ of this._cards$.value) {
            if (card$.value?.id === id) {
                return card$;
            }
        }
        throw new Error('карта не найдена');
    }

    private async addTransactionToHistory(toCard: ICard, fromCard: ICard, amount: number, type: TransactionType): Promise<void> {
        const history: ITransaction = {
            from: fromCard.cardNumber,
            to: toCard.cardNumber,
            type: type,
            amount: amount,
            timestamp: Timestamp.now(),
        };
        const transationsRef: DocumentReference<DocumentData> = await addDoc(collection(this.fs, 'transactions'), history);
        const cardFromHistoryRef: DocumentReference<DocumentData> = doc(this.fs, 'cards history', fromCard.cardNumber);
        const cardToHistoryRef: DocumentReference<DocumentData> = doc(this.fs, 'cards history', toCard.cardNumber);
        if (!(await getDoc(cardToHistoryRef)).exists()) {
            await setDoc(cardToHistoryRef, {
                transactions: [transationsRef]
            });
        } else {
            await updateDoc(cardToHistoryRef, {
                transactions: arrayUnion(transationsRef)
            });
        }
        if (!(await getDoc(cardFromHistoryRef)).exists()) {
            await setDoc(cardFromHistoryRef, {
                transactions: [transationsRef]
            });
        } else {
            await updateDoc(cardFromHistoryRef, {
                transactions: arrayUnion(transationsRef)
            });
        }
    }

    private normalizeWord(word: string): string {
        word = word.toLowerCase();

        return `${word[0].toUpperCase()}${word.slice(1)}`;
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
