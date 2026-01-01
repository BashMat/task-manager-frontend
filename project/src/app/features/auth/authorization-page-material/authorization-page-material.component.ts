import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogInMaterialComponent } from '../log-in-material/log-in-material.component';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'authorization-page-material',
  imports: [RouterOutlet, LogInMaterialComponent, SignUpComponent],
  templateUrl: './authorization-page-material.component.html',
  styleUrl: './authorization-page-material.component.css'
})
export class AuthorizationPageMaterialComponent
{
  shouldShowLogInComponent: boolean = true;

  SwitchComponent(): void
  {
    console.log("Switching Authorization Page component")
    this.shouldShowLogInComponent = !this.shouldShowLogInComponent;
  }
}