import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-restaurant',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTooltipModule,
    MatRippleModule
  ],
  template: `
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="animate-fade-in">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <mat-icon class="text-white text-2xl">add_business</mat-icon>
          </div>
          <h1 class="text-3xl md:text-4xl font-light text-gray-900 mb-3">Add New Restaurant</h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">Help others discover great places to eat by adding a new restaurant to our community</p>
        </div>

        <!-- Form Card -->
        <mat-card class="p-8 shadow-large">
          <form (ngSubmit)="onSubmit()" class="space-y-8">
            <!-- Basic Information -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <mat-icon class="mr-2 text-primary-600">info</mat-icon>
                Basic Information
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Restaurant Name *</mat-label>
                  <input 
                    matInput 
                    [(ngModel)]="restaurant.name" 
                    name="name"
                    placeholder="Enter restaurant name"
                    required>
                  <mat-icon matSuffix class="text-gray-500">restaurant</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Cuisine Type *</mat-label>
                  <mat-select [(ngModel)]="restaurant.cuisine" name="cuisine" required>
                    <mat-option value="">Select cuisine type</mat-option>
                    <mat-option *ngFor="let cuisine of cuisines" [value]="cuisine">
                      {{ cuisine }}
                    </mat-option>
                  </mat-select>
                  <mat-icon matSuffix class="text-gray-500">category</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Address *</mat-label>
                  <input 
                    matInput 
                    [(ngModel)]="restaurant.address" 
                    name="address"
                    placeholder="Enter full address"
                    required>
                  <mat-icon matSuffix class="text-gray-500">location_on</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Phone Number</mat-label>
                  <input 
                    matInput 
                    type="tel"
                    [(ngModel)]="restaurant.phone" 
                    name="phone"
                    placeholder="Enter phone number">
                  <mat-icon matSuffix class="text-gray-500">phone</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Website</mat-label>
                  <input 
                    matInput 
                    type="url"
                    [(ngModel)]="restaurant.website" 
                    name="website"
                    placeholder="Enter website URL">
                  <mat-icon matSuffix class="text-gray-500">language</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Price Range *</mat-label>
                  <mat-select [(ngModel)]="restaurant.priceRange" name="priceRange" required>
                    <mat-option value="">Select price range</mat-option>
                    <mat-option value="Budget">Budget ($)</mat-option>
                    <mat-option value="Moderate">Moderate ($$)</mat-option>
                    <mat-option value="Expensive">Expensive ($$$)</mat-option>
                    <mat-option value="Luxury">Luxury ($$$$)</mat-option>
                  </mat-select>
                  <mat-icon matSuffix class="text-gray-500">attach_money</mat-icon>
                </mat-form-field>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Features -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <mat-icon class="mr-2 text-primary-600">star</mat-icon>
                Features & Amenities
              </h2>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <mat-checkbox 
                  *ngFor="let feature of availableFeatures"
                  [checked]="restaurant.features?.includes(feature)"
                  (change)="toggleFeature(feature)"
                  class="feature-checkbox">
                  {{ feature }}
                </mat-checkbox>
              </div>
              
              <!-- Selected Features Display -->
              <div *ngIf="restaurant.features?.length" class="mt-4">
                <p class="text-sm font-medium text-gray-700 mb-2">Selected features:</p>
                <div class="flex flex-wrap gap-2">
                  <mat-chip *ngFor="let feature of restaurant.features" 
                           class="text-xs bg-primary-100 text-primary-800">
                    {{ feature }}
                  </mat-chip>
                </div>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Hours of Operation -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <mat-icon class="mr-2 text-primary-600">schedule</mat-icon>
                Hours of Operation
              </h2>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <mat-form-field appearance="outline" class="w-full" *ngFor="let day of days">
                  <mat-label>{{ day }}</mat-label>
                  <input 
                    matInput 
                    [(ngModel)]="restaurant.hours![day]" 
                    [name]="'hours-' + day"
                    placeholder="e.g., 9:00 AM - 10:00 PM">
                </mat-form-field>
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" 
                 class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <mat-icon class="text-red-500 mt-0.5">error</mat-icon>
              <div>
                <p class="text-red-800 font-medium">Form validation failed</p>
                <p class="text-red-700 text-sm">{{ errorMessage }}</p>
              </div>
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage" 
                 class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <mat-icon class="text-green-500 mt-0.5">check_circle</mat-icon>
              <div>
                <p class="text-green-800 font-medium">Success!</p>
                <p class="text-green-700 text-sm">{{ successMessage }}</p>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex flex-col sm:flex-row gap-4 justify-end pt-6">
              <button type="button" 
                      mat-button 
                      (click)="onCancel()"
                      class="flex items-center gap-2">
                <mat-icon>cancel</mat-icon>
                Cancel
              </button>
              
              <button type="submit" 
                      mat-raised-button 
                      color="primary" 
                      class="flex items-center gap-2 px-8 py-3"
                      [disabled]="loading || !isFormValid()">
                <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
                <mat-icon *ngIf="!loading">add_business</mat-icon>
                {{ loading ? 'Adding Restaurant...' : 'Add Restaurant' }}
              </button>
            </div>
          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: []
})
export class AddRestaurantComponent implements OnInit {
  restaurant: Partial<Restaurant> = {
    name: '',
    cuisine: '',
    address: '',
    phone: '',
    website: '',
    priceRange: 'Moderate' as any,
    features: [],
    hours: {},
    images: [],
    averageRating: 0,
    totalReviews: 0
  };

  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  cuisines = [
    'Italian', 'Asian', 'American', 'Mexican', 'Mediterranean', 
    'Indian', 'French', 'Japanese', 'Chinese', 'Thai', 'Greek',
    'Spanish', 'German', 'Korean', 'Vietnamese', 'Lebanese', 'Turkish'
  ];

  availableFeatures = [
    'Delivery', 'Takeout', 'Dine-in', 'Outdoor Seating', 'Wheelchair Accessible',
    'Free WiFi', 'Parking', 'Reservations', 'Private Dining', 'Live Music',
    'Bar', 'Wine List', 'Craft Beer', 'Vegetarian Options', 'Vegan Options',
    'Gluten-Free Options', 'Halal', 'Kosher', 'Happy Hour', 'Late Night'
  ];

  days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  constructor(
    private restaurantService: RestaurantService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    // Initialize hours object
    this.days.forEach(day => {
      this.restaurant.hours![day] = '';
    });
  }

  ngOnInit(): void {
    // Check if user is authenticated
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.snackBar.open('Please log in to add a restaurant', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-state']
        });
        this.router.navigate(['/login']);
      }
    });
  }

  toggleFeature(feature: string): void {
    const features = this.restaurant.features || [];
    const index = features.indexOf(feature);
    
    if (index > -1) {
      features.splice(index, 1);
    } else {
      features.push(feature);
    }
    
    this.restaurant.features = features;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.restaurantService.addRestaurant(this.restaurant as Omit<Restaurant, 'id'>).subscribe({
      next: (restaurantId) => {
        this.loading = false;
        this.successMessage = 'Restaurant added successfully!';
        this.snackBar.open('Restaurant added successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['success-state']
        });
        setTimeout(() => {
          this.router.navigate(['/restaurants']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to add restaurant. Please try again.';
        this.snackBar.open('Failed to add restaurant. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-state']
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/restaurants']);
  }

  isFormValid(): boolean {
    return !!(this.restaurant.name?.trim() && 
              this.restaurant.cuisine && 
              this.restaurant.address?.trim() && 
              this.restaurant.priceRange);
  }

  private validateForm(): boolean {
    if (!this.restaurant.name?.trim()) {
      this.errorMessage = 'Restaurant name is required';
      return false;
    }

    if (!this.restaurant.cuisine) {
      this.errorMessage = 'Cuisine type is required';
      return false;
    }

    if (!this.restaurant.address?.trim()) {
      this.errorMessage = 'Address is required';
      return false;
    }

    if (!this.restaurant.priceRange) {
      this.errorMessage = 'Price range is required';
      return false;
    }

    this.errorMessage = '';
    return true;
  }
} 