import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SignInComponent} from '../sign-in/sign-in.component';
import {SignUpComponent} from '../sign-up/sign-up.component';

@Component({
  selector: 'auth-page',
  imports: [RouterOutlet, SignInComponent, SignUpComponent],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css'
})
export class AuthPageComponent {
  shouldShowLogInComponent: boolean = true;

  SwitchComponent(): void {
    this.shouldShowLogInComponent = !this.shouldShowLogInComponent;
  }
}
