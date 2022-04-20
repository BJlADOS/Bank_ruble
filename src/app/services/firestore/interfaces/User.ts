import { DocumentData, DocumentReference } from 'firebase/firestore';

export interface IUser{
    id: string,
    email: string,
    firstName: string,
    surname: string,
    secondName: string,
    passport: string,
    defaultCard: number,
    cards: Array<DocumentReference<DocumentData>>
}