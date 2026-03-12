import {Component} from '@angular/core';
import {UnauthorizedHeaderComponent} from '../../components/layout/unauthorized-header/unauthorized-header.component';

@Component({
  selector: 'unauthorized-layout',
  imports: [UnauthorizedHeaderComponent],
  templateUrl: './unauthorized-layout.component.html',
  styleUrl: './unauthorized-layout.component.css'
})
export class UnauthorizedLayoutComponent {
}