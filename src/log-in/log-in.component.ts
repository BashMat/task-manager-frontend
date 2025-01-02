import { Component, EventEmitter, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TaskManagerBackendService } from '../services/task-manager-backend.service';

@Component({
  selector: 'log-in',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  message: string = "Default message";

  logInForm = new FormGroup(
    {
      logInData: new FormControl(""),
      password: new FormControl(""),
    });

  @Output() switchComponentEvent = new EventEmitter<any>();

  constructor(private taskManagerBackendService: TaskManagerBackendService)
  {
    this.taskManagerBackendService = taskManagerBackendService;
  }

  GoToSignUp(): void
  {
    console.log("Going to Sign Up");
    this.switchComponentEvent.emit();
  }

  LogIn(): void
  {
    console.log("Log In button pressed.")
    console.log("Log In Data:", this.logInForm.value.logInData)
    if (this.logInForm.value.logInData === null || this.logInForm.value.password === null || 
      this.logInForm.value.logInData === undefined || this.logInForm.value.password === undefined)
    {
      console.log("Values cannot be null");
      return;
    }
    this.taskManagerBackendService.LogIn(this.logInForm.value.logInData!, this.logInForm.value.password!);
    
  }
}