import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatBadgeModule,
    MatChipsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatRippleModule,
    MatCardModule
  ],
  template: `
    <div class="min-h-screen" style="background-color: #f9fafb;">
      <!-- Responsive Header -->
      <mat-toolbar class="bg-white border-b border-gray-200">
        <div class="flex justify-between items-center w-full px-2 sm:px-4">
          <!-- Logo -->
          <div class="flex items-center space-x-2 sm:space-x-3">
            <button mat-button routerLink="/" class="flex items-center space-x-2 text-gray-800 hover:text-primary-700 transition-colors">
              <mat-icon class="text-primary-600 text-lg sm:text-xl">restaurant</mat-icon>
              <span class="text-lg sm:text-xl font-semibold">FoodRater</span>
            </button>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-2">
            <button mat-button routerLink="/" class="flex items-center">
              <mat-icon class="mr-1">home</mat-icon>
              Home
            </button>
            <button mat-button routerLink="/restaurants" class="flex items-center">
              <mat-icon class="mr-1">restaurant_menu</mat-icon>
              Restaurants
            </button>
            
            <!-- Auth buttons -->
            <button mat-button routerLink="/login">Login</button>
            <button mat-raised-button color="primary" routerLink="/signup" class="px-4">Sign Up</button>
          </div>
          
          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button mat-icon-button [matMenuTriggerFor]="mobileMenu" class="text-gray-600">
              <mat-icon>menu</mat-icon>
            </button>
            <mat-menu #mobileMenu="matMenu" class="mobile-menu">
              <button mat-menu-item routerLink="/" class="flex items-center">
                <mat-icon class="mr-3">home</mat-icon>
                Home
              </button>
              <button mat-menu-item routerLink="/restaurants" class="flex items-center">
                <mat-icon class="mr-3">restaurant_menu</mat-icon>
                Restaurants
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item routerLink="/login" class="flex items-center">
                <mat-icon class="mr-3">login</mat-icon>
                Login
              </button>
              <button mat-menu-item routerLink="/signup" class="flex items-center">
                <mat-icon class="mr-3">person_add</mat-icon>
                Sign Up
              </button>
            </mat-menu>
          </div>
        </div>
      </mat-toolbar>
      
      <!-- Main Content -->
      <main class="p-3 sm:p-4 md:p-6">
        <div class="max-w-6xl mx-auto">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 text-center sm:text-left">Welcome to FoodRater</h1>
          <p class="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 text-center sm:text-left">Find and rate the best restaurants in your area.</p>
          
          <!-- Responsive Navigation Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <mat-card class="cursor-pointer hover:shadow-lg transition-shadow duration-300" routerLink="/restaurants">
              <mat-card-content class="p-4 sm:p-6 text-center">
                <mat-icon class="text-3xl sm:text-4xl text-primary-600 mb-3 sm:mb-4">restaurant_menu</mat-icon>
                <h3 class="text-lg sm:text-xl font-semibold mb-2">Browse Restaurants</h3>
                <p class="text-sm sm:text-base text-gray-600">Discover amazing places to eat</p>
              </mat-card-content>
            </mat-card>
            
            <mat-card class="cursor-pointer hover:shadow-lg transition-shadow duration-300" routerLink="/add-restaurant">
              <mat-card-content class="p-4 sm:p-6 text-center">
                <mat-icon class="text-3xl sm:text-4xl text-primary-600 mb-3 sm:mb-4">add_business</mat-icon>
                <h3 class="text-lg sm:text-xl font-semibold mb-2">Add Restaurant</h3>
                <p class="text-sm sm:text-base text-gray-600">Share your favorite spots</p>
              </mat-card-content>
            </mat-card>
            
            <mat-card class="cursor-pointer hover:shadow-lg transition-shadow duration-300" routerLink="/bulk-add-restaurants">
              <mat-card-content class="p-4 sm:p-6 text-center">
                <mat-icon class="text-3xl sm:text-4xl text-primary-600 mb-3 sm:mb-4">library_add</mat-icon>
                <h3 class="text-lg sm:text-xl font-semibold mb-2">Bulk Add</h3>
                <p class="text-sm sm:text-base text-gray-600">Add 100 sample restaurants</p>
              </mat-card-content>
            </mat-card>
            
            <mat-card class="cursor-pointer hover:shadow-lg transition-shadow duration-300" routerLink="/restaurants">
              <mat-card-content class="p-4 sm:p-6 text-center">
                <mat-icon class="text-3xl sm:text-4xl text-primary-600 mb-3 sm:mb-4">rate_review</mat-icon>
                <h3 class="text-lg sm:text-xl font-semibold mb-2">Rate & Review</h3>
                <p class="text-sm sm:text-base text-gray-600">Share your dining experiences</p>
              </mat-card-content>
            </mat-card>
          </div>
          
          <!-- Router Outlet -->
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .mobile-menu {
      min-width: 200px;
    }
    
    .mobile-menu .mat-mdc-menu-item {
      height: 48px;
      padding: 0 16px;
    }
    
    .mobile-menu .mat-mdc-menu-item mat-icon {
      margin-right: 12px;
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  breakpointObserver = inject(BreakpointObserver);
  isLoading = true;

  constructor() {
    console.log('AppComponent initialized');
    
    // Simulate loading time and hide loading screen
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  signOut(): void {
    this.authService.signOut().subscribe({
      next: () => {
        this.snackBar.open('Signed out successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['success-state']
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error signing out', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-state']
        });
      }
    });
  }
}
