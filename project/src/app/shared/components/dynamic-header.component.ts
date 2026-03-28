import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dynamic-header',
  imports: [RouterLink, MatToolbarModule, MatIcon, MatIconButton, MatMenuModule, CommonModule],
  templateUrl: './dynamic-header.component.html',
  styleUrl: './dynamic-header.component.css'
})
export class DynamicHeaderComponent {
  private authService = inject(AuthService);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  GoToUserProfile() {
    // TODO: Use actual username
    let username = "test";
    this.router.navigateByUrl(`/${username}`);
  }

  SignOut() {
    this.localStorageService.DeleteTokens();
    this.router.navigateByUrl('/auth');
  }
}