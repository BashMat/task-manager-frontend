import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogInMaterialComponent } from '../log-in-material/log-in-material.component';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'auth-page-material',
  imports: [RouterOutlet, LogInMaterialComponent, SignUpComponent],
  templateUrl: './auth-page-material.component.html',
  styleUrl: './auth-page-material.component.css'
})
export class AuthPageMaterialComponent
{
  shouldShowLogInComponent: boolean = true;

  SwitchComponent(): void
  {
    console.log("Switching Auth Page component")
    this.shouldShowLogInComponent = !this.shouldShowLogInComponent;
  }
}