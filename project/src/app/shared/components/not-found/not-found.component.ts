import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DynamicHeaderComponent } from '../dynamic-header.component';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule, DynamicHeaderComponent],
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {}