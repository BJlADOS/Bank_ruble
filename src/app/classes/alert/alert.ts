export class Alert {
    public type: AlertType;
    public message: string;
    public fade: boolean = false;

    constructor(type: AlertType, message: string) {
        this.message = message;
        this.type = type;
    }
};

export enum AlertType {
    error = 'alert alert-error',
    success = 'alert alert-success'
}