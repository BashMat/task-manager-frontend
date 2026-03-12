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
  selector: 'sign-in',
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
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  message: string = 'Default message';

  signInForm = new FormGroup(
    {
      username: new FormControl('',
        [Validators.required]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8)])
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

  GoToSignUp(): void {
    console.log('Going to Sign Up');
    this.switchComponentEvent.emit();
  }

  SignIn(): void {
    if (this.signInForm.value.username === null || this.signInForm.value.password === null ||
      this.signInForm.value.username === undefined || this.signInForm.value.password === undefined) {
      console.log('Values cannot be null');
      return;
    }
    this.taskManagerBackendService.IssueTokenByPassword(this.signInForm.value.username!, this.signInForm.value.password!)
        .subscribe(
          {
            next: () => {
              const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
              this.router.navigateByUrl(returnUrl);
            },
            error: () => {
              console.log('Error occured during Signing In');
            }
          });
  }
}
