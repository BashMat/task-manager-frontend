import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'authorized-header-material',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatIcon,
    MatIconButton,
    MatMenuModule 
  ],
  templateUrl: './authorized-header-material.component.html',
  styleUrl: './authorized-header-material.component.css'
})
export class AuthorizedHeaderMaterialComponent {

  constructor(private localStorageService: LocalStorageService,
              private router: Router)
  {
    this.localStorageService = localStorageService;
    this.router = router;
  }

  SignOut()
  {
    this.localStorageService.DeleteAccessToken();
    this.router.navigateByUrl("/");
  }
}