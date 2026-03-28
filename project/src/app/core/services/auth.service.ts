import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private localStorageService = inject(LocalStorageService);

  isAuthenticated(): boolean {
    return this.localStorageService.HasValidToken();
  }
}