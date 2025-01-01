import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogInComponent } from "../log-in/log-in.component";
import { SignUpComponent } from '../sign-up/sign-up.component';
import { BoardsPageComponent } from "../boards-page/boards-page.component";

@Component({
  selector: 'app',
  imports: [RouterOutlet, LogInComponent, SignUpComponent, BoardsPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}