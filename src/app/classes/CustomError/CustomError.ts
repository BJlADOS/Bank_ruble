export class CustomError {
    public state: boolean;
    public message: string;

    constructor(message: string, state: boolean) {
        this.message = message;
        this.state = state;
    }
}