import { Component } from '@angular/core';
import { AppFooterComponent } from '../../components/layout/footer/app-footer.component';
import { UnauthorizedHeaderComponent } from '../../components/layout/unauthorized-header/unauthorized-header.component';

@Component({
  selector: 'unauthorized-layout',
  imports: [AppFooterComponent, UnauthorizedHeaderComponent],
  templateUrl: './unauthorized-layout.component.html',
  styleUrl: './unauthorized-layout.component.css'
})
export class UnauthorizedLayoutComponent {}