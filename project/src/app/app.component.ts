import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { PageLayout } from './shared/layouts/page-layout.enum';
import { PageLayoutService } from './shared/layouts/page-layout.service';
import { AuthorizedLayoutMaterialComponent } from './shared/layouts/authorized-material/authorized-layout-material.component';
import { UnauthorizedLayoutMaterialComponent } from './shared/layouts/unauthorized-material/unauthorized-layout-material.component';

@Component({
  selector: 'app',
  imports: [
    RouterOutlet,
    AuthorizedLayoutMaterialComponent,
    UnauthorizedLayoutMaterialComponent,
    AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent
{
  readonly PageLayout = PageLayout;

  constructor(public pageLayoutService: PageLayoutService)
  {
    this.pageLayoutService = pageLayoutService;
  }
}
