import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {LocalStorageService} from '../../../../core/services/local-storage.service';
import {MatMenuModule} from '@angular/material/menu';
import {TaskManagerBackendService} from '../../../../core/services/task-manager-backend.service';

@Component({
  selector: 'authorized-header',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatIcon,
    MatIconButton,
    MatMenuModule
  ],
  templateUrl: './authorized-header.component.html',
  styleUrl: './authorized-header.component.css'
})
export class AuthorizedHeaderComponent {

  constructor(private taskManagerBackendService: TaskManagerBackendService,
              private localStorageService: LocalStorageService,
              private router: Router) {
    this.taskManagerBackendService = taskManagerBackendService;
    this.localStorageService = localStorageService;
    this.router = router;
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
    // TODO: Works for all pages only because /auth is not used for already authenticated user.
    // If "/" is used, then during Sign Out from "/", navigateByUrl will not redirect because
    // Router does not do same URL navigation by default. Simple implementation did not work.
    // See: onSameUrlNavigation at NavigationBehaviorOptions and RouteReuseStrategy
    this.router.navigateByUrl('/auth');
  }
}
