import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';

@Component({
  selector: 'app-add-restaurant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-restaurant-container">
      <div class="add-restaurant-card card">
        <div class="card-header">
          <h2>Add New Restaurant</h2>
          <p>Help others discover great places to eat</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="restaurant-form">
          <div class="form-group">
            <label for="name" class="form-label">Restaurant Name *</label>
            <input 
              type="text" 
              id="name"
              [(ngModel)]="restaurant.name" 
              name="name"
              class="form-control" 
              placeholder="Enter restaurant name"
              required
            >
          </div>

          <div class="form-group">
            <label for="cuisine" class="form-label">Cuisine Type *</label>
            <select 
              id="cuisine"
              [(ngModel)]="restaurant.cuisine" 
              name="cuisine"
              class="form-control" 
              required
            >
              <option value="">Select cuisine type</option>
              <option *ngFor="let cuisine of cuisines" [value]="cuisine">{{ cuisine }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="address" class="form-label">Address *</label>
            <input 
              type="text" 
              id="address"
              [(ngModel)]="restaurant.address" 
              name="address"
              class="form-control" 
              placeholder="Enter full address"
              required
            >
          </div>

          <div class="form-group">
            <label for="phone" class="form-label">Phone Number</label>
            <input 
              type="tel" 
              id="phone"
              [(ngModel)]="restaurant.phone" 
              name="phone"
              class="form-control" 
              placeholder="Enter phone number"
            >
          </div>

          <div class="form-group">
            <label for="website" class="form-label">Website</label>
            <input 
              type="url" 
              id="website"
              [(ngModel)]="restaurant.website" 
              name="website"
              class="form-control" 
              placeholder="Enter website URL"
            >
          </div>

          <div class="form-group">
            <label for="priceRange" class="form-label">Price Range *</label>
            <select 
              id="priceRange"
              [(ngModel)]="restaurant.priceRange" 
              name="priceRange"
              class="form-control" 
              required
            >
              <option value="">Select price range</option>
              <option value="Budget">Budget ($)</option>
              <option value="Moderate">Moderate ($$)</option>
              <option value="Expensive">Expensive ($$$)</option>
              <option value="Luxury">Luxury ($$$$)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="features" class="form-label">Features</label>
            <div class="features-grid">
              <label class="feature-checkbox" *ngFor="let feature of availableFeatures">
                <input 
                  type="checkbox" 
                  [value]="feature"
                  (change)="toggleFeature(feature)"
                  [checked]="restaurant.features?.includes(feature)"
                >
                {{ feature }}
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="hours" class="form-label">Hours of Operation</label>
            <div class="hours-grid">
              <div class="hour-item" *ngFor="let day of days">
                <label>{{ day }}</label>
                <input 
                  type="text" 
                  [(ngModel)]="restaurant.hours![day]" 
                  [name]="'hours-' + day"
                  class="form-control" 
                  placeholder="e.g., 9:00 AM - 10:00 PM"
                >
              </div>
            </div>
          </div>

          <div class="alert alert-error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="alert alert-success" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn" [disabled]="loading">
              <span *ngIf="loading" class="spinner-small"></span>
              {{ loading ? 'Adding Restaurant...' : 'Add Restaurant' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .add-restaurant-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .add-restaurant-card {
      padding: 40px;
    }

    .card-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .card-header h2 {
      font-size: 2rem;
      margin-bottom: 10px;
      color: #333;
    }

    .card-header p {
      color: #666;
      font-size: 1rem;
    }

    .restaurant-form {
      display: grid;
      gap: 20px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
    }

    .feature-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .feature-checkbox:hover {
      background-color: #f8f9fa;
    }

    .feature-checkbox input[type="checkbox"] {
      margin: 0;
    }

    .hours-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .hour-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .hour-item label {
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 20px;
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

    @media (max-width: 768px) {
      .add-restaurant-card {
        padding: 20px;
      }

      .card-header h2 {
        font-size: 1.5rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .hours-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AddRestaurantComponent {
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
    private router: Router
  ) {
    // Initialize hours object
    this.days.forEach(day => {
      this.restaurant.hours![day] = '';
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
        setTimeout(() => {
          this.router.navigate(['/restaurants']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to add restaurant. Please try again.';
        // Error adding restaurant
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/restaurants']);
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

    return true;
  }
} 