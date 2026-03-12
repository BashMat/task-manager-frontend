import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'unauthorized-header',
  templateUrl: './unauthorized-header.component.html',
  styleUrl: './unauthorized-header.component.css',
  imports: [RouterLink, MatToolbarModule]
})
export class UnauthorizedHeaderComponent {
}