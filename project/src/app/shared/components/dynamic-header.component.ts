import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {TaskManagerBackendService} from '../../core/services/task-manager-backend.service';
import { BackgroundSettingsDialog } from './dialogs/background-settings-dialog/background-settings-dialog.component';

@Component({
  selector: 'dynamic-header',
  imports: [RouterLink, MatToolbarModule, MatIcon, MatIconButton, MatMenuModule, MatDividerModule, CommonModule],
  templateUrl: './dynamic-header.component.html',
  styleUrl: './dynamic-header.component.css'
})
export class DynamicHeaderComponent {
  private authService = inject(AuthService);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);
  private taskManagerBackendService = inject(TaskManagerBackendService);
  private dialog = inject(MatDialog);

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  OpenSettings() {
    this.dialog.open(BackgroundSettingsDialog, {
      width: '360px',
      autoFocus: false,
      backdropClass: 'bg-picker-backdrop'
    });
  }

  GoToBoards() {
    this.router.navigateByUrl('/boards');
  }

  GoToUserProfile() {
    this.taskManagerBackendService.GetCurrentUserData().subscribe((response)=> {
        if (response.success) {
          this.router.navigateByUrl(`/${response.data.userName}`);
        } else {
          console.log("Error occurred while trying to get current user data from server");
        }
      }
    )
  }

  SignOut() {
    this.localStorageService.DeleteTokens();
    this.router.navigateByUrl('/auth');
  }
}