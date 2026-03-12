import {Component, EventEmitter, Output, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TaskManagerBackendService} from '../../../core/services/task-manager-backend.service';
import {NgOptimizedImage} from '@angular/common';
import {MatCard, MatCardActions, MatCardContent} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'sign-up',
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
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  message: String = 'Default message';

  signUpForm = new FormGroup(
    {
      email: new FormControl('',
        [Validators.required, Validators.email]
      ),
      username: new FormControl('',
        [Validators.required]
      ),
      // TODO: Add validation rule to check repeated password
      password: new FormControl('',
        [Validators.required, Validators.minLength(8)]
      ),
      passwordRepeated: new FormControl('',
        [Validators.required, Validators.minLength(8)]
      )
    });

  @Output() switchComponentEvent = new EventEmitter<any>();
  hide = signal(true);

  constructor(private taskManagerBackendService: TaskManagerBackendService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.taskManagerBackendService = taskManagerBackendService;
    this.activatedRoute = activatedRoute;
    this.router = router;
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  GoToLogIn(): void {
    this.switchComponentEvent.emit();
  }

  SignUp(): void {
    if (this.signUpForm.value.password !== this.signUpForm.value.passwordRepeated) {
      console.log('Password must be the same');
      return;
    }

    if (this.signUpForm.value.email === null || this.signUpForm.value.password === null ||
      this.signUpForm.value.email === undefined || this.signUpForm.value.password === undefined ||
      this.signUpForm.value.username === null || this.signUpForm.value.username === undefined) {
      console.log('Values cannot be null');
      return;
    }

    this.taskManagerBackendService.SignUpNew(this.signUpForm.value.email!, this.signUpForm.value.username, this.signUpForm.value.password)
        .subscribe(
          {
            next: () => {
              this.taskManagerBackendService.IssueTokenByPassword(this.signUpForm.value.email!, this.signUpForm.value.password!)
                  .subscribe(
                    {
                      next: () => {
                        const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
                        this.router.navigateByUrl(returnUrl);
                      },
                      error: () => {
                        console.log('Error occured during Signing Up');
                      }
                    });
            },
            error: () => {
              console.log('Error occured during Signing Up');
            }
          });
  }
}
