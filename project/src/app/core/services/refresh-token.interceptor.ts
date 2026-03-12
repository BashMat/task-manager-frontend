import {Inject, inject} from '@angular/core';
import {HttpErrorResponse, HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {switchMap, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {TaskManagerBackendService} from './task-manager-backend.service';
import {LocalStorageService} from './local-storage.service';

export function refreshTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const taskManagerService = inject(TaskManagerBackendService);
  const localStorageService = inject(LocalStorageService);

  return next(req).pipe(
    catchError((error, caught) => {
        const responseError = error as HttpErrorResponse;
        if (responseError.status === 401) {
          return taskManagerService.IssueTokenByRefreshToken().pipe(
            // After token refresh succeeds, update the request with new token
            switchMap(() => {
              // Clone the request with the new token
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${localStorageService.GetAccessToken()}`
                }
              });
              // Retry the original request with the new token
              return next(clonedReq);
            }),
            // Handle token refresh errors
            catchError(refreshError => {
              // Token refresh failed - redirect to login or handle appropriately
              console.error('Token refresh failed', refreshError);
              // You might want to redirect to login page here
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      }
    )
  );
}
