import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card card">
        <div class="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your FoodRater account</p>
        </div>

        <form (ngSubmit)="onLogin()" class="auth-form">
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
              placeholder="Enter your password"
              required
            >
          </div>

          <div class="alert alert-error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn w-full" [disabled]="loading">
            <span *ngIf="loading" class="spinner-small"></span>
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/signup" class="auth-link">Sign up</a></p>
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
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.signIn(this.email, this.password).subscribe({
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
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return 'An error occurred during sign in. Please try again';
    }
  }
} 