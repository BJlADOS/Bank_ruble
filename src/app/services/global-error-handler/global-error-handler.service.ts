import { ErrorHandler, Injectable } from '@angular/core';
import { AlertService } from '../alert/alert.service';

@Injectable()  
export class GlobalErrorHandlerService implements ErrorHandler {

    constructor(
        public alert: AlertService,
    ) { }

    public handleError(error: Error): void {
        this.alert.error(error.message);
    }
}
