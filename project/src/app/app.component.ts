import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { PageLayout } from './shared/layouts/page-layout.enum';
import { PageLayoutService } from './shared/layouts/page-layout.service';
import { AuthorizedLayoutComponent } from './shared/layouts/authorized/authorized-layout.component';
import { UnauthorizedLayoutComponent } from './shared/layouts/unauthorized/unauthorized-layout.component';

@Component({
  selector: 'app',
  imports: [RouterOutlet, AuthorizedLayoutComponent, UnauthorizedLayoutComponent, AsyncPipe],
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