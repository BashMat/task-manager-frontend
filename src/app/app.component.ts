import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogInComponent } from "../log-in/log-in.component";
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app',
  imports: [RouterOutlet, LogInComponent, SignUpComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}