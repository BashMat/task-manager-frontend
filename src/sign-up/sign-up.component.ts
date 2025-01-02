import { Component, EventEmitter, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sign-up',
  imports: [RouterOutlet],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  message: String = 'Default message';

  @Output() switchComponentEvent = new EventEmitter<any>();

  GoToLogIn(): void
  {
    console.log("Going to Log In");
    this.switchComponentEvent.emit();
  }
}