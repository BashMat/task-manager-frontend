import {ChangeDetectionStrategy, signal} from '@angular/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, RouterOutlet, Router } from '@angular/router';
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
  selector: 'log-in-material',
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
  templateUrl: './log-in-material.component.html',
  styleUrl: './log-in-material.component.css'
})
export class LogInMaterialComponent {
  message: string = "Default message";

  logInForm = new FormGroup(
    {
      logInData: new FormControl("",
        [ Validators.required ]),
      password: new FormControl("",
        [ Validators.required, Validators.minLength(8) ]),
    });

  @Output() switchComponentEvent = new EventEmitter<any>();

  constructor(private taskManagerBackendService: TaskManagerBackendService,
              private activatedRoute: ActivatedRoute,
              private router: Router)
  {
    this.taskManagerBackendService = taskManagerBackendService;
    this.activatedRoute = activatedRoute;
    this.router = router;
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
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
    this.taskManagerBackendService.IssueTokenByPassword(this.logInForm.value.logInData!, this.logInForm.value.password!)
                                  .subscribe(
                                    {
                                      next: () =>
                                            {
                                              const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
                                              console.log("Logged In.");
                                              console.log("Returning to");
                                              console.log(returnUrl);
                                              this.router.navigateByUrl(returnUrl);
                                            },
                                      error: () =>
                                             {
                                               console.log("Error occured during loggin in");
                                             }
                                    });
  }
}
