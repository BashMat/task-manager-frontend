import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { TaskManagerBackendService } from '../core/services/task-manager-backend.service';

export type ProfileResult =
  | { status: 'visible'; user: { userName: string } }
  | { status: 'not-found' };

export const userResolver = (): ResolveFn<ProfileResult> =>
{
    return (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
        {
            const backend = inject(TaskManagerBackendService);
            const requestedUsername = route.params['username'];

            return backend.GetCurrentUserData().pipe(
                map((response): ProfileResult => {
                    if (response.success && response.data.userName === requestedUsername) {
                        return { status: 'visible', user: { userName: response.data.userName } };
                    }
                    return { status: 'not-found' };
                }),
                catchError(error => {
                    console.error('Failed to resolve profile for username', requestedUsername, error);
                    return of<ProfileResult>({ status: 'not-found' });
                })
            );
        };
}