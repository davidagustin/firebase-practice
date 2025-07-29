import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant, Review } from '../../models/restaurant.model';
import { RatingComponent } from '../../shared/rating/rating.component';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [CommonModule, RatingComponent],
  template: `
    <div class="restaurant-detail-container" *ngIf="restaurant$ | async as restaurant; else loading">
      <div class="restaurant-header">
        <div class="restaurant-info">
          <h1>{{ restaurant.name }}</h1>
          <p class="cuisine">{{ restaurant.cuisine }}</p>
          <div class="rating-section">
            <app-rating [rating]="restaurant.averageRating" [readonly]="true"></app-rating>
            <span class="review-count">{{ restaurant.totalReviews }} reviews</span>
          </div>
          <div class="price-range">{{ restaurant.priceRange }}</div>
        </div>
      </div>

      <div class="restaurant-content">
        <div class="restaurant-details card">
          <h3>Restaurant Details</h3>
          <div class="detail-item">
            <strong>📍 Address:</strong> {{ restaurant.address }}
          </div>
          <div class="detail-item" *ngIf="restaurant.phone">
            <strong>📞 Phone:</strong> {{ restaurant.phone }}
          </div>
          <div class="detail-item" *ngIf="restaurant.website">
            <strong>🌐 Website:</strong> <a [href]="restaurant.website" target="_blank">{{ restaurant.website }}</a>
          </div>
          
          <div class="features" *ngIf="restaurant.features.length > 0">
            <h4>Features</h4>
            <div class="feature-tags">
              <span class="feature-tag" *ngFor="let feature of restaurant.features">{{ feature }}</span>
            </div>
          </div>

          <div class="hours" *ngIf="restaurant.hours">
            <h4>Hours of Operation</h4>
            <div class="hours-list">
              <div class="hour-item" *ngFor="let day of getDays()">
                <span class="day">{{ day }}:</span>
                <span class="time">{{ restaurant.hours[day] || 'Closed' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="reviews-section">
          <h3>Reviews</h3>
          <div class="reviews-list" *ngIf="reviews$ | async as reviews; else noReviews">
            <div class="review-item card" *ngFor="let review of reviews">
              <div class="review-header">
                <div class="reviewer-info">
                  <strong>{{ review.userName }}</strong>
                  <span class="review-date">{{ review.date | date:'mediumDate' }}</span>
                </div>
                <app-rating [rating]="review.rating" [readonly]="true"></app-rating>
              </div>
              <p class="review-comment">{{ review.comment }}</p>
              <div class="review-actions">
                <button class="helpful-btn">👍 Helpful ({{ review.helpful }})</button>
              </div>
            </div>
          </div>
          <ng-template #noReviews>
            <p class="no-reviews">No reviews yet. Be the first to review this restaurant!</p>
          </ng-template>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Loading restaurant details...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .restaurant-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .restaurant-header {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      color: white;
      padding: 40px 20px;
      border-radius: 12px;
      margin-bottom: 30px;
    }

    .restaurant-info h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      font-weight: 700;
    }

    .cuisine {
      font-size: 1.2rem;
      margin-bottom: 15px;
      opacity: 0.9;
    }

    .rating-section {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }

    .review-count {
      font-size: 1rem;
      opacity: 0.9;
    }

    .price-range {
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 16px;
      border-radius: 20px;
      display: inline-block;
      font-weight: 600;
    }

    .restaurant-content {
      display: grid;
      gap: 30px;
    }

    .restaurant-details h3 {
      margin-bottom: 20px;
      color: #333;
      font-size: 1.5rem;
    }

    .detail-item {
      margin-bottom: 15px;
      color: #666;
    }

    .detail-item strong {
      color: #333;
    }

    .detail-item a {
      color: #ff6b6b;
      text-decoration: none;
    }

    .detail-item a:hover {
      text-decoration: underline;
    }

    .features h4 {
      margin: 20px 0 10px 0;
      color: #333;
    }

    .feature-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .feature-tag {
      background: #f8f9fa;
      color: #495057;
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 0.9rem;
    }

    .hours h4 {
      margin: 20px 0 10px 0;
      color: #333;
    }

    .hours-list {
      display: grid;
      gap: 8px;
    }

    .hour-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .day {
      font-weight: 600;
      color: #333;
    }

    .time {
      color: #666;
    }

    .reviews-section h3 {
      margin-bottom: 20px;
      color: #333;
      font-size: 1.5rem;
    }

    .review-item {
      margin-bottom: 20px;
      padding: 20px;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }

    .reviewer-info {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .review-date {
      font-size: 0.9rem;
      color: #666;
    }

    .review-comment {
      color: #333;
      line-height: 1.6;
      margin-bottom: 15px;
    }

    .helpful-btn {
      background: none;
      border: 1px solid #ddd;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      color: #666;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    .helpful-btn:hover {
      background: #f8f9fa;
      border-color: #ff6b6b;
      color: #ff6b6b;
    }

    .no-reviews {
      text-align: center;
      color: #666;
      padding: 40px 20px;
    }

    .loading-container {
      text-align: center;
      padding: 60px 20px;
    }

    .loading-container p {
      margin-top: 20px;
      color: #666;
    }

    @media (max-width: 768px) {
      .restaurant-info h1 {
        font-size: 2rem;
      }

      .review-header {
        flex-direction: column;
        gap: 10px;
      }

      .hour-item {
        flex-direction: column;
        gap: 5px;
      }
    }
  `]
})
export class RestaurantDetailComponent implements OnInit {
  restaurant$: Observable<Restaurant | null>;
  reviews$: Observable<Review[]>;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService
  ) {
    this.restaurant$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.restaurantService.getRestaurant(id))
    );

    this.reviews$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.restaurantService.getRestaurantReviews(id))
    );
  }

  ngOnInit(): void {}

  getDays(): string[] {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  }
} 