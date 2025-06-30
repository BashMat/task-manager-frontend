import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'authorized-header',
  imports: [ RouterLink ],
  templateUrl: './authorized-header.component.html',
  styleUrl: './authorized-header.component.css'
})
export class AuthorizedHeaderComponent {}