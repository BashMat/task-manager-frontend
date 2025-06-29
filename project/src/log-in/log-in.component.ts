import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, RouterOutlet, Router } from '@angular/router';
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

  constructor(private taskManagerBackendService: TaskManagerBackendService,
              private activatedRoute: ActivatedRoute,
              private router: Router)
  {
    this.taskManagerBackendService = taskManagerBackendService;
    this.activatedRoute = activatedRoute;
    this.router = router;
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
    this.taskManagerBackendService.LogIn(this.logInForm.value.logInData!, this.logInForm.value.password!)
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