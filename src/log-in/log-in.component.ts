import { Component, EventEmitter, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'log-in',
  imports: [RouterOutlet],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  message: String = 'Default message';

  @Output() switchComponentEvent = new EventEmitter<any>();

  GoToSignUp(): void
  {
    console.log("Going to Sign Up");
    this.switchComponentEvent.emit();
  }
}