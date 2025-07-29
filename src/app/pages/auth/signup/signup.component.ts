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
  selector: 'app-signup',
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
            <mat-icon class="text-white text-2xl">person_add</mat-icon>
          </div>
          <h2 class="text-3xl font-light text-gray-900 mb-2">Join FoodRater</h2>
          <p class="text-gray-600">Create your account to start rating restaurants</p>
        </div>

        <!-- Signup Form -->
        <mat-card class="p-8 shadow-large">
          <form (ngSubmit)="onSignup()" class="space-y-6">
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
                placeholder="Create a password"
                required
                [disabled]="loading"
                minlength="6">
              <mat-icon matSuffix class="text-gray-500 cursor-pointer" 
                        (click)="showPassword = !showPassword"
                        [matTooltip]="showPassword ? 'Hide password' : 'Show password'">
                {{ showPassword ? 'visibility_off' : 'visibility' }}
              </mat-icon>
              <mat-hint>Password must be at least 6 characters long</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Confirm Password</mat-label>
              <input 
                matInput 
                [type]="showConfirmPassword ? 'text' : 'password'"
                [(ngModel)]="confirmPassword" 
                name="confirmPassword"
                placeholder="Confirm your password"
                required
                [disabled]="loading">
              <mat-icon matSuffix class="text-gray-500 cursor-pointer" 
                        (click)="showConfirmPassword = !showConfirmPassword"
                        [matTooltip]="showConfirmPassword ? 'Hide password' : 'Show password'">
                {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
              </mat-icon>
            </mat-form-field>

            <!-- Password Strength Indicator -->
            <div *ngIf="password" class="space-y-2">
              <p class="text-sm font-medium text-gray-700">Password strength:</p>
              <div class="flex space-x-1">
                <div class="flex-1 h-2 rounded-full bg-gray-200">
                  <div class="h-full rounded-full transition-all duration-300"
                       [class]="getPasswordStrengthClass()"
                       [style.width.%]="getPasswordStrength()"></div>
                </div>
              </div>
              <p class="text-xs text-gray-500">{{ getPasswordStrengthText() }}</p>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" 
                 class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <mat-icon class="text-red-500 mt-0.5">error</mat-icon>
              <div>
                <p class="text-red-800 font-medium">Account creation failed</p>
                <p class="text-red-700 text-sm">{{ errorMessage }}</p>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" 
                    mat-raised-button 
                    color="primary" 
                    class="w-full py-3 text-lg"
                    [disabled]="loading || !isFormValid()">
              <mat-spinner diameter="20" *ngIf="loading" class="mr-2"></mat-spinner>
              <mat-icon *ngIf="!loading" class="mr-2">person_add</mat-icon>
              {{ loading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>

          <mat-divider class="my-6"></mat-divider>

          <!-- Footer -->
          <div class="text-center">
            <p class="text-gray-600">
              Already have an account? 
              <a routerLink="/auth/login" 
                 class="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </mat-card>

        <!-- Additional Info -->
        <div class="text-center">
          <p class="text-sm text-gray-500">
            By creating an account, you agree to our 
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
export class SignupComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSignup(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.signUp(this.email, this.password).subscribe({
      next: (user) => {
        this.loading = false;
        if (user) {
          this.snackBar.open('Account created successfully! Welcome to FoodRater!', 'Close', {
            duration: 4000,
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

  isFormValid(): boolean {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  getPasswordStrength(): number {
    if (!this.password) return 0;
    
    let strength = 0;
    if (this.password.length >= 6) strength += 25;
    if (this.password.length >= 8) strength += 25;
    if (/[a-z]/.test(this.password)) strength += 25;
    if (/[A-Z]/.test(this.password)) strength += 25;
    if (/[0-9]/.test(this.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(this.password)) strength += 25;
    
    return Math.min(strength, 100);
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength < 50) return 'bg-red-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength < 50) return 'Weak password';
    if (strength < 75) return 'Medium strength password';
    return 'Strong password';
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
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return 'An error occurred during account creation. Please try again';
    }
  }
} 