import { Component } from '@angular/core';
import { AppFooterComponent } from '../../components/layout/footer/app-footer.component';
import { AuthorizedHeaderComponent } from '../../components/layout/header/authorized-header.component';
import { HomePageComponent } from "../../../features/home/home-page/home-page.component";

@Component({
  selector: 'authorized-layout',
  imports: [AppFooterComponent, AuthorizedHeaderComponent, HomePageComponent],
  templateUrl: './authorized-layout.component.html',
  styleUrl: './authorized-layout.component.css'
})
export class AuthorizedLayoutComponent {}