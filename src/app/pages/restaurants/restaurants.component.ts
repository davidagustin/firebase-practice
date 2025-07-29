import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';
import { RatingComponent } from '../../shared/rating/rating.component';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, RatingComponent],
  template: `
    <div class="restaurants-header">
      <h1>All Restaurants</h1>
      <p>Discover amazing places to eat in your area</p>
    </div>

    <div class="filters-section">
      <div class="search-filter">
        <input 
          type="text" 
          placeholder="Search restaurants..."
          [(ngModel)]="searchTerm"
          class="form-control"
        >
      </div>
      
      <div class="filter-options">
        <select [(ngModel)]="selectedCuisine" class="form-control">
          <option value="">All Cuisines</option>
          <option *ngFor="let cuisine of cuisines" [value]="cuisine">{{ cuisine }}</option>
        </select>
        
        <select [(ngModel)]="selectedPriceRange" class="form-control">
          <option value="">All Price Ranges</option>
          <option value="Budget">Budget</option>
          <option value="Moderate">Moderate</option>
          <option value="Expensive">Expensive</option>
          <option value="Luxury">Luxury</option>
        </select>
        
        <select [(ngModel)]="sortBy" class="form-control">
          <option value="rating">Sort by Rating</option>
          <option value="name">Sort by Name</option>
          <option value="reviews">Sort by Reviews</option>
        </select>
      </div>
    </div>

    <div class="restaurants-grid" *ngIf="filteredRestaurants$ | async as restaurants; else loading">
      <div class="restaurant-item card" *ngFor="let restaurant of restaurants">
        <div class="restaurant-header">
          <div class="restaurant-image">
            <img [src]="restaurant.images[0] || 'assets/default-restaurant.jpg'" [alt]="restaurant.name">
          </div>
          <div class="restaurant-basic-info">
            <h3>{{ restaurant.name }}</h3>
            <p class="cuisine">{{ restaurant.cuisine }}</p>
            <div class="rating-section">
              <app-rating [rating]="restaurant.averageRating" [readonly]="true"></app-rating>
              <span class="review-count">{{ restaurant.totalReviews }} reviews</span>
            </div>
            <div class="price-range">{{ restaurant.priceRange }}</div>
          </div>
        </div>
        
        <div class="restaurant-details">
          <p class="address">
            <strong>📍</strong> {{ restaurant.address }}
          </p>
          <p class="phone" *ngIf="restaurant.phone">
            <strong>📞</strong> {{ restaurant.phone }}
          </p>
          <div class="features" *ngIf="restaurant.features.length > 0">
            <span class="feature-tag" *ngFor="let feature of restaurant.features.slice(0, 3)">
              {{ feature }}
            </span>
          </div>
        </div>
        
        <div class="restaurant-actions">
          <a [routerLink]="['/restaurant', restaurant.id]" class="btn">View Details</a>
          <button class="btn btn-secondary" (click)="addToFavorites(restaurant)">❤️</button>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Loading restaurants...</p>
      </div>
    </ng-template>

    <div class="no-results" *ngIf="(filteredRestaurants$ | async)?.length === 0">
      <h3>No restaurants found</h3>
      <p>Try adjusting your search criteria or filters</p>
    </div>
  `,
  styles: [`
    .restaurants-header {
      text-align: center;
      margin-bottom: 40px;
      padding: 40px 20px;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      color: white;
      border-radius: 12px;
    }

    .restaurants-header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      font-weight: 700;
    }

    .restaurants-header p {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .filters-section {
      margin-bottom: 40px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .search-filter {
      margin-bottom: 20px;
    }

    .filter-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .restaurants-grid {
      display: grid;
      gap: 20px;
    }

    .restaurant-item {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .restaurant-header {
      display: flex;
      gap: 20px;
    }

    .restaurant-image {
      width: 120px;
      height: 120px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .restaurant-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .restaurant-basic-info {
      flex: 1;
    }

    .restaurant-basic-info h3 {
      font-size: 1.4rem;
      margin-bottom: 8px;
      color: #333;
    }

    .cuisine {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 10px;
    }

    .rating-section {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .review-count {
      color: #666;
      font-size: 0.9rem;
    }

    .price-range {
      background: #f8f9fa;
      color: #666;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      display: inline-block;
    }

    .restaurant-details {
      border-top: 1px solid #eee;
      padding-top: 15px;
    }

    .address, .phone {
      margin-bottom: 8px;
      color: #666;
      font-size: 0.9rem;
    }

    .features {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .feature-tag {
      background: #e9ecef;
      color: #495057;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
    }

    .restaurant-actions {
      display: flex;
      gap: 10px;
      justify-content: space-between;
      align-items: center;
    }

    .restaurant-actions .btn {
      flex: 1;
    }

    .restaurant-actions .btn-secondary {
      flex: 0 0 auto;
      padding: 12px;
      font-size: 1.2rem;
    }

    .loading-container {
      text-align: center;
      padding: 60px 20px;
    }

    .loading-container p {
      margin-top: 20px;
      color: #666;
    }

    .no-results {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-results h3 {
      margin-bottom: 10px;
      color: #333;
    }

    @media (max-width: 768px) {
      .restaurants-header h1 {
        font-size: 2rem;
      }

      .restaurant-header {
        flex-direction: column;
        gap: 15px;
      }

      .restaurant-image {
        width: 100%;
        height: 200px;
      }

      .filter-options {
        grid-template-columns: 1fr;
      }

      .restaurant-actions {
        flex-direction: column;
      }
    }
  `]
})
export class RestaurantsComponent implements OnInit {
  restaurants$: Observable<Restaurant[]>;
  filteredRestaurants$!: Observable<Restaurant[]>;
  
  searchTerm: string = '';
  selectedCuisine: string = '';
  selectedPriceRange: string = '';
  sortBy: string = 'rating';
  
  cuisines: string[] = [
    'Italian', 'Asian', 'American', 'Mexican', 'Mediterranean', 
    'Indian', 'French', 'Japanese', 'Chinese', 'Thai', 'Greek'
  ];

  constructor(private restaurantService: RestaurantService) {
    this.restaurants$ = this.restaurantService.getRestaurants();
    this.setupFilteredRestaurants();
  }

  ngOnInit(): void {}

  private setupFilteredRestaurants(): void {
    this.filteredRestaurants$ = combineLatest([
      this.restaurants$,
      this.getSearchTerm$(),
      this.getCuisineFilter$(),
      this.getPriceRangeFilter$(),
      this.getSortBy$()
    ]).pipe(
      map(([restaurants, searchTerm, cuisine, priceRange, sortBy]) => {
        let filtered = restaurants;

        // Apply search filter
        if (searchTerm) {
          filtered = filtered.filter(restaurant =>
            restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Apply cuisine filter
        if (cuisine) {
          filtered = filtered.filter(restaurant => restaurant.cuisine === cuisine);
        }

        // Apply price range filter
        if (priceRange) {
          filtered = filtered.filter(restaurant => restaurant.priceRange === priceRange);
        }

        // Apply sorting
        filtered = this.sortRestaurants(filtered, sortBy);

        return filtered;
      })
    );
  }

  private getSearchTerm$() {
    return new Observable<string>(observer => {
      observer.next(this.searchTerm);
      // This is a simplified version - in a real app you'd use proper reactive forms
    });
  }

  private getCuisineFilter$() {
    return new Observable<string>(observer => {
      observer.next(this.selectedCuisine);
    });
  }

  private getPriceRangeFilter$() {
    return new Observable<string>(observer => {
      observer.next(this.selectedPriceRange);
    });
  }

  private getSortBy$() {
    return new Observable<string>(observer => {
      observer.next(this.sortBy);
    });
  }

  private sortRestaurants(restaurants: Restaurant[], sortBy: string): Restaurant[] {
    return [...restaurants].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'reviews':
          return b.totalReviews - a.totalReviews;
        default:
          return 0;
      }
    });
  }

  addToFavorites(restaurant: Restaurant): void {
    // Implement favorites functionality
    console.log('Added to favorites:', restaurant.name);
  }
} 