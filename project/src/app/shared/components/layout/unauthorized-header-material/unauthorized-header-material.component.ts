import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'unauthorized-header-material',
  templateUrl: './unauthorized-header-material.component.html',
  styleUrl: './unauthorized-header-material.component.css',
  imports: [ RouterLink, MatToolbarModule ]
})
export class UnauthorizedHeaderMaterialComponent {}