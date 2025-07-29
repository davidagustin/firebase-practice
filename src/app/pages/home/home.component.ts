import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';
import { RatingComponent } from '../../shared/rating/rating.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, RatingComponent],
  template: `
    <div class="hero-section">
      <div class="hero-content">
        <h1>Find the Best Restaurants</h1>
        <p>Discover amazing places to eat, read reviews, and share your experiences</p>
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search restaurants, cuisines, or locations..."
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
            class="search-input"
          >
          <button class="search-btn">🔍</button>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Featured Restaurants -->
      <section class="featured-section">
        <h2>Top Rated Restaurants</h2>
        <div class="grid grid-3" *ngIf="topRestaurants$ | async as restaurants; else loading">
          <div class="restaurant-card card" *ngFor="let restaurant of restaurants">
            <div class="restaurant-image">
              <img [src]="restaurant.images[0] || 'assets/default-restaurant.jpg'" [alt]="restaurant.name">
            </div>
            <div class="restaurant-info">
              <h3>{{ restaurant.name }}</h3>
              <p class="cuisine">{{ restaurant.cuisine }}</p>
              <div class="rating-info">
                <app-rating [rating]="restaurant.averageRating" [readonly]="true"></app-rating>
                <span class="review-count">({{ restaurant.totalReviews }} reviews)</span>
              </div>
              <p class="address">{{ restaurant.address }}</p>
              <div class="price-range">{{ restaurant.priceRange }}</div>
              <a [routerLink]="['/restaurant', restaurant.id]" class="btn">View Details</a>
            </div>
          </div>
        </div>
        <ng-template #loading>
          <div class="spinner"></div>
        </ng-template>
      </section>

      <!-- Categories -->
      <section class="categories-section">
        <h2>Browse by Category</h2>
        <div class="categories-grid">
          <div class="category-card" *ngFor="let category of categories">
            <div class="category-icon">{{ category.icon }}</div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
          </div>
        </div>
      </section>

      <!-- How it Works -->
      <section class="how-it-works">
        <h2>How FoodRater Works</h2>
        <div class="steps-grid">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Search</h3>
            <p>Find restaurants in your area or browse by cuisine type</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Read Reviews</h3>
            <p>See what others are saying about their dining experience</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Rate & Review</h3>
            <p>Share your own experience and help others make great choices</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      color: white;
      padding: 80px 20px;
      text-align: center;
      margin-bottom: 40px;
    }

    .hero-content h1 {
      font-size: 3rem;
      margin-bottom: 20px;
      font-weight: 700;
    }

    .hero-content p {
      font-size: 1.2rem;
      margin-bottom: 40px;
      opacity: 0.9;
    }

    .search-box {
      max-width: 500px;
      margin: 0 auto;
      display: flex;
      background: white;
      border-radius: 50px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .search-input {
      flex: 1;
      padding: 15px 20px;
      border: none;
      font-size: 1rem;
      outline: none;
    }

    .search-btn {
      background: #ff6b6b;
      color: white;
      border: none;
      padding: 15px 20px;
      cursor: pointer;
      font-size: 1.2rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .featured-section {
      margin-bottom: 60px;
    }

    .featured-section h2 {
      font-size: 2rem;
      margin-bottom: 30px;
      text-align: center;
      color: #333;
    }

    .restaurant-card {
      overflow: hidden;
      cursor: pointer;
    }

    .restaurant-image {
      height: 200px;
      overflow: hidden;
      border-radius: 8px 8px 0 0;
    }

    .restaurant-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .restaurant-info {
      padding: 20px;
    }

    .restaurant-info h3 {
      font-size: 1.3rem;
      margin-bottom: 8px;
      color: #333;
    }

    .cuisine {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 10px;
    }

    .rating-info {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .review-count {
      color: #666;
      font-size: 0.9rem;
    }

    .address {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 10px;
    }

    .price-range {
      background: #f8f9fa;
      color: #666;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      display: inline-block;
      margin-bottom: 15px;
    }

    .categories-section {
      margin-bottom: 60px;
    }

    .categories-section h2 {
      font-size: 2rem;
      margin-bottom: 30px;
      text-align: center;
      color: #333;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .category-card {
      background: white;
      padding: 30px 20px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .category-card:hover {
      transform: translateY(-5px);
    }

    .category-icon {
      font-size: 3rem;
      margin-bottom: 15px;
    }

    .category-card h3 {
      margin-bottom: 10px;
      color: #333;
    }

    .category-card p {
      color: #666;
      font-size: 0.9rem;
    }

    .how-it-works {
      margin-bottom: 60px;
    }

    .how-it-works h2 {
      font-size: 2rem;
      margin-bottom: 40px;
      text-align: center;
      color: #333;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
    }

    .step {
      text-align: center;
      padding: 30px 20px;
    }

    .step-number {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 auto 20px;
    }

    .step h3 {
      margin-bottom: 15px;
      color: #333;
    }

    .step p {
      color: #666;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2rem;
      }

      .hero-content p {
        font-size: 1rem;
      }

      .search-box {
        flex-direction: column;
        border-radius: 12px;
      }

      .search-input,
      .search-btn {
        border-radius: 0;
      }

      .categories-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .steps-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  topRestaurants$: Observable<Restaurant[]>;
  searchTerm: string = '';
  
  categories = [
    { name: 'Italian', icon: '🍝', description: 'Pizza, pasta, and more' },
    { name: 'Asian', icon: '🍜', description: 'Chinese, Japanese, Thai' },
    { name: 'American', icon: '🍔', description: 'Burgers, BBQ, comfort food' },
    { name: 'Mexican', icon: '🌮', description: 'Tacos, burritos, enchiladas' },
    { name: 'Mediterranean', icon: '🥙', description: 'Greek, Lebanese, Turkish' },
    { name: 'Desserts', icon: '🍰', description: 'Cakes, ice cream, pastries' }
  ];

  constructor(private restaurantService: RestaurantService) {
    this.topRestaurants$ = this.restaurantService.getTopRatedRestaurants(6);
  }

  ngOnInit(): void {}

  onSearch(): void {
    // Implement search functionality
    console.log('Searching for:', this.searchTerm);
  }
} 