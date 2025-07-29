import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card card">
        <div class="auth-header">
          <h2>Join FoodRater</h2>
          <p>Create your account to start rating restaurants</p>
        </div>

        <form (ngSubmit)="onSignup()" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email"
              [(ngModel)]="email" 
              name="email"
              class="form-control" 
              placeholder="Enter your email"
              required
            >
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              id="password"
              [(ngModel)]="password" 
              name="password"
              class="form-control" 
              placeholder="Create a password"
              required
            >
            <small class="form-help">Password must be at least 6 characters long</small>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword"
              [(ngModel)]="confirmPassword" 
              name="confirmPassword"
              class="form-control" 
              placeholder="Confirm your password"
              required
            >
          </div>

          <div class="alert alert-error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn w-full" [disabled]="loading">
            <span *ngIf="loading" class="spinner-small"></span>
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login" class="auth-link">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: 20px;
    }

    .auth-card {
      max-width: 400px;
      width: 100%;
      padding: 40px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .auth-header h2 {
      font-size: 2rem;
      margin-bottom: 10px;
      color: #333;
    }

    .auth-header p {
      color: #666;
      font-size: 1rem;
    }

    .auth-form {
      margin-bottom: 30px;
    }

    .form-help {
      display: block;
      margin-top: 5px;
      font-size: 0.8rem;
      color: #666;
    }

    .auth-footer {
      text-align: center;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }

    .auth-footer p {
      color: #666;
      margin: 0;
    }

    .auth-link {
      color: #ff6b6b;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-link:hover {
      text-decoration: underline;
    }

    .spinner-small {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .w-full {
      width: 100%;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 30px 20px;
      }

      .auth-header h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSignup(): void {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.signUp(this.email, this.password).subscribe({
      next: (user) => {
        this.loading = false;
        if (user) {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = this.getErrorMessage(error.code);
      }
    });
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support';
      default:
        return 'An error occurred during account creation. Please try again';
    }
  }
} 