export interface ICard {
    cardNumber: string,
    expirationDate: string,
    owner: string,
    cvv: string,
    name: string,
    balance: number, 
    isBanned: boolean,
    id: string
}