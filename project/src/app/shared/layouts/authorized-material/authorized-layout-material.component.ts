import { Component } from '@angular/core';
import { AuthorizedHeaderMaterialComponent } from '../../components/layout/authorized-header-material/authorized-header-material.component';

@Component({
  selector: 'authorized-layout-material',
  imports: [ AuthorizedHeaderMaterialComponent ],
  templateUrl: './authorized-layout-material.component.html',
  styleUrl: './authorized-layout-material.component.css'
})
export class AuthorizedLayoutMaterialComponent {}