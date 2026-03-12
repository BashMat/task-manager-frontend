import { Component } from '@angular/core';
import { AuthorizedHeaderComponent } from '../../components/layout/authorized-header/authorized-header.component';

@Component({
  selector: 'authorized-layout',
  imports: [ AuthorizedHeaderComponent ],
  templateUrl: './authorized-layout.component.html',
  styleUrl: './authorized-layout.component.css'
})
export class AuthorizedLayoutComponent {}
