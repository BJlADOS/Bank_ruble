import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { arrayUnion, doc, DocumentData, DocumentReference, DocumentSnapshot, Firestore, getDoc, query, setDoc, where } from '@angular/fire/firestore';
import { collection, getDocs, Query, QueryDocumentSnapshot, QuerySnapshot, updateDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { CardGenerator } from 'src/app/classes/card-generator/card-generator';
import { ICard } from './interfaces/Card';
import { IUser } from './interfaces/User';
import { CardType } from './types/card-type';

@Injectable()
export class FirestoreService {

    private _user$: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);

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
        if(userToken) {
            this.loadUser(userToken.uid).then((user: IUser) => {
                this._user$.next(user);
            });
        } else {
            this._user$.next(null);;
        }
    }

    public updateUser(user: IUser): void {
        this.loadUser(user.id).then((u: IUser) => {
            this._user$.next(u);
        });
    }

    public async loadUser(id: string): Promise<IUser> {
        const userDoc: DocumentReference<DocumentData> = doc(this.fs, 'users', id);
        const userSnap: DocumentSnapshot<DocumentData> = await getDoc(userDoc);
        const user: IUser = userSnap.data() as IUser;

        return user;
    }

    public async updateUserData(user: IUser): Promise<void> {
        const userRef: DocumentReference<DocumentData> = doc(this.fs, 'users', user.id);
        await updateDoc(userRef, {
            firstName: user.firstName,
            surname: user.surname,
            secondName: user.secondName,
            passport: user.passport,
            defaultCard: user.defaultCard,
        });
        this._user$.next(user);
    }

    public async getUserCards(): Promise<ICard[]> {
        const cards: ICard[] = [];
        for (const cardRef of this._user$.value!.cards) {
            const cardSnap: DocumentSnapshot<DocumentData> = await getDoc(cardRef);
            cards.push(cardSnap.data() as ICard);
        }

        return cards;
    }

    public async getCard(cardNumber: string): Promise<ICard> {
        const cardDoc: DocumentReference<DocumentData> = this.getCardReference(cardNumber);
        const cardSnap: DocumentSnapshot<DocumentData> = await getDoc(cardDoc);

        if(cardSnap.data()) {
            return cardSnap.data() as ICard;
        } else {
            throw new Error('Такой карты не существует');
        } 
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
        if (!this.checkUserForCardCreation(user)) {
            throw new Error('Для создания карты данные пользователя должны быть заполнены');
        }
        let isValid: boolean = false;
        let cardNumber: string = '';
        while(!isValid) {
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
        this.updateUser(user);
    }

    public init(): void {
        //init method
    }

    private checkUserForCardCreation(user: IUser): boolean {

        if (user.firstName.length === 0) {
            return false;
        }
        if (user.surname.length === 0)
        {
            return false;
        } 
        if (user.secondName.length === 0)
        {
            return false;
        }          
        if (user.passport.length === 0)
        {
            return false;
        } 

        return true;
    }

    private getCardReference(cardNumber: string): DocumentReference<DocumentData> {
        return doc(this.fs, 'cards', cardNumber);
    }
}
