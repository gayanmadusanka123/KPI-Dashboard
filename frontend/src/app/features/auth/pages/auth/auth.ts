import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth implements OnInit {
  mode: 'login' | 'signup' = 'login';
  submitting = false;
  errorMessage = '';
  successMessage = '';

  private readonly formBuilder = inject(FormBuilder);
  // Using non-nullable form group
  readonly form = this.formBuilder.nonNullable.group({
    userName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['']
  });

  constructor(
    private readonly auth: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'] === 'signup' ? 'signup' : 'login';
    this.configureForm();
    if (this.route.snapshot.queryParamMap.get('reason') === 'session-expired') {
      this.errorMessage = 'Your session expired. Please sign in again.';
    } else if (this.route.snapshot.queryParamMap.get('registered') === 'true') {
      this.successMessage = 'Account created successfully. Please sign in.';
    }
  }

  get isSignup(): boolean {
    return this.mode === 'signup';
  }

  // Handle form submission for login or signup
  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.form.markAllAsTouched();

    if (this.form.invalid || (this.isSignup && this.form.controls.password.value !== this.form.controls.confirmPassword.value)) {
      if (this.isSignup && this.form.controls.password.value !== this.form.controls.confirmPassword.value) {
        this.errorMessage = 'Passwords do not match.';
      }
      return;
    }

    this.submitting = true;
    const { userName, email, password } = this.form.getRawValue();
    const request = this.isSignup
      ? { userName, email, password, role: 'ROLE_USER' as const }
      : { email, password };
      // Determine the operation based on the mode (login/signup)
    const operation = this.isSignup ? this.auth.signup(request) : this.auth.login(request);

    operation.subscribe({
      next: response => {
        this.submitting = false;
        if (this.isSignup) {
          void this.router.navigateByUrl('/dashboard');
        } else {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
          void this.router.navigateByUrl(returnUrl);
        }
      },
      error: error => {
        this.submitting = false;
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  // Configure form validators based on the mode (login/signup)
  private configureForm(): void {
    const userName = this.form.controls.userName;
    const confirmPassword = this.form.controls.confirmPassword;
    if (this.isSignup) {
      userName.setValidators([Validators.required, Validators.minLength(2)]);
      confirmPassword.setValidators([Validators.required]);
    } else {
      userName.clearValidators();
      confirmPassword.clearValidators();
    }
    userName.updateValueAndValidity();
    confirmPassword.updateValueAndValidity();
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'Unable to connect to the server. Please try again.';
      if (error.status === 401) return 'Invalid email or password.';
      if (error.status === 409) return 'An account with this email already exists.';
      if (typeof error.error?.message === 'string') return error.error.message;
    }
    return 'Something went wrong. Please try again.';
  }
}
