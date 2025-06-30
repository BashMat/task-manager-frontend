import { Component } from '@angular/core';
import { AppFooterComponent } from '../../components/layout/footer/app-footer.component';
import { AuthorizedHeaderComponent } from '../../components/layout/authorized-header/authorized-header.component';

@Component({
  selector: 'authorized-layout',
  imports: [AppFooterComponent, AuthorizedHeaderComponent],
  templateUrl: './authorized-layout.component.html',
  styleUrl: './authorized-layout.component.css'
})
export class AuthorizedLayoutComponent {}