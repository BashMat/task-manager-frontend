import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'authorized-header-material',
  imports: [ RouterLink, MatToolbarModule ],
  templateUrl: './authorized-header-material.component.html',
  styleUrl: './authorized-header-material.component.css'
})
export class AuthorizedHeaderComponent {}