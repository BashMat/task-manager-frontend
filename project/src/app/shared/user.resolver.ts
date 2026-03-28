import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

export const userResolver = (): ResolveFn<string> =>
{
    return (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
        {
            return _route.params['username'];
        };
}