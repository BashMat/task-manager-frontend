import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogInComponent } from '../log-in/log-in.component';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'authorization-page',
  imports: [RouterOutlet, LogInComponent, SignUpComponent],
  templateUrl: './authorization-page.component.html',
  styleUrl: './authorization-page.component.css'
})
export class AuthorizationPageComponent
{
  shouldShowLogInComponent: boolean = true;

  SwitchComponent(): void
  {
    console.log("Switching Authorization Page component")
    this.shouldShowLogInComponent = !this.shouldShowLogInComponent;
  }
}