import { trigger, transition, style, animate, state, AnimationStyleMetadata } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Alert } from '../classes/alert/alert';
import { AlertService } from '../services/alert/alert.service';
import { DestroyService } from '../services/destoyService/destroy.service';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    animations: [
        trigger('contentSlide', [
            transition('void=>*', [
                style({ transform: 'translateX(100%)' }),
                animate('.7s', style({ transform: 'translateX(0)' }))
            ]),
            state('expanded', style({ transform: 'translateX(0)' })),
            state('collapsed', style({ transform: 'translateX(100%)' })),
            transition('expanded <=> collapsed',
                animate('1s cubic-bezier(.37,1.04,.68,.98)')),
        ]),
    ]
})
export class AlertComponent implements OnInit {
    public alerts: Alert[] = [];
    private _destroyDelay: number = 3700;
    private _dissappearDelay: number = 1000;
    constructor(
        private _alertService: AlertService,
        private _router: Router,
        private _destroy$: DestroyService,
    ) { }

    public ngOnInit(): void {
        this._alertService.onAlert().pipe(takeUntil(this._destroy$)).subscribe((alert: Alert) => {
            this.alerts.push(alert);
            setTimeout(() => {
                this.removeAlert(alert);
            }, this._destroyDelay);
        });
    }

    private removeAlert(alert: Alert): void {
        if (!this.alerts.includes(alert)) {
            return;
        }

        setTimeout(() => {
            this.alerts = this.alerts.filter((aler: Alert) => aler !== alert);
        }, this._dissappearDelay);
        alert.fade = true;
    }
}
