import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer-material',
  templateUrl: './app-footer-material.component.html',
  styleUrl: './app-footer-material.component.css',
  imports: [ MatToolbarModule ]
})
export class AppFooterMaterialComponent {}