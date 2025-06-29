import { Component, EventEmitter, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';

@Component({
  selector: 'sign-up',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  message: String = 'Default message';

  signUpForm = new FormGroup(
    {
      email: new FormControl(""),
      userName: new FormControl(""),
      password: new FormControl(""),
      passwordRepeated: new FormControl("")
    })

  @Output() switchComponentEvent = new EventEmitter<any>();

  constructor(private taskManagerBackendService: TaskManagerBackendService)
  {
    this.taskManagerBackendService = taskManagerBackendService;
  }

  GoToLogIn(): void
  {
    console.log("Going to Log In");
    this.switchComponentEvent.emit();
  }

  SignUp(): void
  {
    if (this.signUpForm.value.password !== this.signUpForm.value.passwordRepeated)
    {
      console.log("Password must be the same")
      return;
    }

    if (this.signUpForm.value.email === null || this.signUpForm.value.password === null || 
       this.signUpForm.value.email === undefined || this.signUpForm.value.password === undefined || 
       this.signUpForm.value.userName === null || this.signUpForm.value.userName === undefined)
    {
      console.log("Values cannot be null");
      return;
    }

    this.taskManagerBackendService.SignUp(this.signUpForm.value.email, this.signUpForm.value.userName, this.signUpForm.value.password)
  }
}