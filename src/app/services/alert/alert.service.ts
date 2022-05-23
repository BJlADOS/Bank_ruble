import { isNull } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable, Subject } from 'rxjs';
import { Alert, AlertType } from 'src/app/classes/alert/alert';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    private _subject$: Subject<Alert> = new Subject<Alert>();
    
    constructor() { }

    public onAlert(): Observable<Alert> {
        return this._subject$.asObservable();
    }

    public success(message: string): void {
        this.alert(new Alert(AlertType.success, message));
    }

    public error(message: string): void {
        this.alert(new Alert(AlertType.error, message));
    }

    public alert(alert: Alert): void {
        this._subject$.next(alert);
    }

}
