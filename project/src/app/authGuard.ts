import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from './core/services/local-storage.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private localStorageService: LocalStorageService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    {
        if (this.localStorageService.HasValidToken()) 
        {
            return true;
        }

        this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url }});
        return false;
    }

}

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private localStorageService: LocalStorageService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    {
        if (this.localStorageService.HasValidToken()) 
        {
            this.router.navigate(['/profile']);
            return false;
        }
        
        return true;
    }
}