import { Component, EventEmitter, Output } from '@angular/core';
import {ChangeDetectionStrategy, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TaskManagerBackendService } from '../../../core/services/task-manager-backend.service';
import { NgOptimizedImage } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sign-up-material',
  imports: [
    RouterOutlet,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    NgOptimizedImage
  ],
  templateUrl: './sign-up-material.component.html',
  styleUrl: './sign-up-material.component.css'
})
export class SignUpMaterialComponent {
  message: String = 'Default message';

  signUpForm = new FormGroup(
    {
      email: new FormControl("",
        [Validators.required, Validators.email]
      ),
      username: new FormControl("",
        [Validators.required]
      ),
      // TODO: Add validation rule to check repeated password
      password: new FormControl("",
        [Validators.required, Validators.minLength(8)]
      ),
      passwordRepeated: new FormControl("",
        [Validators.required, Validators.minLength(8)]
      )
    })

  @Output() switchComponentEvent = new EventEmitter<any>();

  constructor(private taskManagerBackendService: TaskManagerBackendService) {
    this.taskManagerBackendService = taskManagerBackendService;
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  GoToLogIn(): void {
    console.log("Going to Log In");
    this.switchComponentEvent.emit();
  }

  SignUp(): void {
    if (this.signUpForm.value.password !== this.signUpForm.value.passwordRepeated) {
      console.log("Password must be the same")
      return;
    }

    if (this.signUpForm.value.email === null || this.signUpForm.value.password === null ||
      this.signUpForm.value.email === undefined || this.signUpForm.value.password === undefined ||
      this.signUpForm.value.username === null || this.signUpForm.value.username === undefined) {
      console.log("Values cannot be null");
      return;
    }

    this.taskManagerBackendService.SignUp(this.signUpForm.value.email, this.signUpForm.value.username, this.signUpForm.value.password)
  }
}