import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { PageLayout } from './page-layout.enum';
import { PageLayoutService } from './page-layout.service';
import { LocalStorageService } from '../../core/services/local-storage.service';

export const autoLayout = (): ResolveFn<void> => 
{
    return (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => 
        {
            const authService = inject(LocalStorageService);
            const layoutService = inject(PageLayoutService);
            
            const isAuthenticated = authService.HasValidToken();
            const layout = isAuthenticated ? PageLayout.Authorized : PageLayout.Unauthorized;
            
            layoutService.setLayout(layout);
        };
}
