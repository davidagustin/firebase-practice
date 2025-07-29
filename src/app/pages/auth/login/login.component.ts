import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule,
    MatRippleModule,
    MatTooltipModule
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 animate-fade-in">
        <!-- Header -->
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <mat-icon class="text-white text-2xl">restaurant</mat-icon>
          </div>
          <h2 class="text-3xl font-light text-gray-900 mb-2">Welcome Back</h2>
          <p class="text-gray-600">Sign in to your FoodRater account</p>
        </div>

        <!-- Login Form -->
        <mat-card class="p-8 shadow-large">
          <form (ngSubmit)="onLogin()" class="space-y-6">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Email Address</mat-label>
              <input 
                matInput 
                type="email" 
                [(ngModel)]="email" 
                name="email"
                placeholder="Enter your email"
                required
                [disabled]="loading">
              <mat-icon matSuffix class="text-gray-500">email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Password</mat-label>
              <input 
                matInput 
                [type]="showPassword ? 'text' : 'password'"
                [(ngModel)]="password" 
                name="password"
                placeholder="Enter your password"
                required
                [disabled]="loading">
              <mat-icon matSuffix class="text-gray-500 cursor-pointer" 
                        (click)="showPassword = !showPassword"
                        [matTooltip]="showPassword ? 'Hide password' : 'Show password'">
                {{ showPassword ? 'visibility_off' : 'visibility' }}
              </mat-icon>
            </mat-form-field>

            <!-- Error Message -->
            <div *ngIf="errorMessage" 
                 class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <mat-icon class="text-red-500 mt-0.5">error</mat-icon>
              <div>
                <p class="text-red-800 font-medium">Sign in failed</p>
                <p class="text-red-700 text-sm">{{ errorMessage }}</p>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" 
                    mat-raised-button 
                    color="primary" 
                    class="w-full py-3 text-lg"
                    [disabled]="loading || !email || !password">
              <mat-spinner diameter="20" *ngIf="loading" class="mr-2"></mat-spinner>
              <mat-icon *ngIf="!loading" class="mr-2">login</mat-icon>
              {{ loading ? 'Signing In...' : 'Sign In' }}
            </button>
          </form>

          <mat-divider class="my-6"></mat-divider>

          <!-- Footer -->
          <div class="text-center">
            <p class="text-gray-600">
              Don't have an account? 
              <a routerLink="/auth/signup" 
                 class="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Sign up
              </a>
            </p>
          </div>
        </mat-card>

        <!-- Additional Info -->
        <div class="text-center">
          <p class="text-sm text-gray-500">
            By signing in, you agree to our 
            <a href="#" class="text-primary-600 hover:text-primary-700">Terms of Service</a> 
            and 
            <a href="#" class="text-primary-600 hover:text-primary-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
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
          this.snackBar.open('Welcome back!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['success-state']
          });
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
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return 'An error occurred during sign in. Please try again';
    }
  }
} 