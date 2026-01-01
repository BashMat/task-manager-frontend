import { Component } from '@angular/core';
import { AppFooterMaterialComponent } from '../../components/layout/footer-material/app-footer-material.component';
import { UnauthorizedHeaderMaterialComponent } from '../../components/layout/unauthorized-header-material/unauthorized-header-material.component';

@Component({
  selector: 'unauthorized-layout-material',
  imports: [ AppFooterMaterialComponent, UnauthorizedHeaderMaterialComponent ],
  templateUrl: './unauthorized-layout-material.component.html',
  styleUrl: './unauthorized-layout-material.component.css'
})
export class UnauthorizedLayoutMaterialComponent {}