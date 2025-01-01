import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogInComponent } from "../log-in/log-in.component";

@Component({
  selector: 'app',
  imports: [RouterOutlet, LogInComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'task-manager-frontend';
}