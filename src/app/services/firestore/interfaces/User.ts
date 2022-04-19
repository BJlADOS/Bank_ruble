import { DocumentData, DocumentReference } from 'firebase/firestore';
import { ICard } from './Card';

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