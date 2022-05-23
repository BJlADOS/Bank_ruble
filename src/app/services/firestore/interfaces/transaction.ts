import { Timestamp } from 'firebase/firestore';

export interface ITransaction {
    from: string,
    to: string,
    type: TransactionType,
    amount: number,
    timestamp: Timestamp,
}

export interface ITransactionTarget {
    name: string,
    number: string,
    icon: string,
}

export enum TransactionType {
    self = 'self',
    to = 'to',
}