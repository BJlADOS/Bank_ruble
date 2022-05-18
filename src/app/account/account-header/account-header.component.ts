import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, ActivationStart, ChildActivationEnd, ChildActivationStart, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent, Scroll, UrlSegment } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { IBreadcrumb } from 'src/app/interfaces/breadcrumb/breadcrumb';
import { AuthService } from 'src/app/services/authService/auth.service';
import { DestroyService } from 'src/app/services/destoyService/destroy.service';
import { AccountHeaderBreadcrumbComponent } from './account-header-breadcrumb/account-header-breadcrumb.component';

@Component({
    selector: 'app-account-header',
    templateUrl: './account-header.component.html',
    styleUrls: ['./account-header.component.scss']
})
export class AccountHeaderComponent implements OnInit {
    public breadcrumbs: IBreadcrumb[] = [];

    constructor(
        public router: Router,
        public activatedRoute: ActivatedRoute,
        private _auth: AuthService,
        private _destroy$: DestroyService,
    ) { }
    public ngOnInit(): void {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
        this.router.events
            .pipe(filter((event: RouterEvent | RouteConfigLoadStart | RouteConfigLoadEnd | ChildActivationStart | ChildActivationEnd | ActivationStart | ActivationEnd | Scroll) => event instanceof NavigationEnd), takeUntil(this._destroy$))
            .subscribe(() => this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root));
    }

    public logOut(): void {
        this._auth.logout();
    }

    public isActive(path: string): boolean {
        return this.router.url === path;
    }

    private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
        const children: ActivatedRoute[] = route.children;
        if (children.length === 0) {
            return breadcrumbs;
        }
    
        for (const child of children) {
            const routeURL: string = child.snapshot.url.map((segment: UrlSegment) => segment.path).join('/');
            if (routeURL !== '') {
                url += `/${routeURL}`;
            }
    
            const label: string = child.snapshot.data['breadcrumb'];
            if (label) {
                breadcrumbs.push({ label, url });
            }
    
            return this.createBreadcrumbs(child, url, breadcrumbs);
        }

        return breadcrumbs;
    }
}
