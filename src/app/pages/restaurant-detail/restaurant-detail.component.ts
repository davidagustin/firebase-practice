import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant, Review } from '../../models/restaurant.model';
import { RatingComponent } from '../../shared/rating/rating.component';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RatingComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatRippleModule,
    MatSnackBarModule
  ],
  template: `
    <div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8" *ngIf="restaurant$ | async as restaurant; else loading">
      <div class="animate-fade-in">
        <!-- Restaurant Header -->
        <div class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white rounded-2xl overflow-hidden mb-8">
          <div class="absolute inset-0 bg-black/20"></div>
          <div class="relative p-8 md:p-12">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div class="flex-1">
                <h1 class="text-3xl md:text-4xl font-light mb-3">{{ restaurant.name }}</h1>
                <p class="text-lg md:text-xl opacity-90 mb-4">{{ restaurant.cuisine }}</p>
                
                <div class="flex flex-wrap items-center gap-4 mb-6">
                  <div class="flex items-center gap-2">
                    <app-rating [rating]="restaurant.averageRating" [readonly]="true"></app-rating>
                    <span class="text-lg font-medium">{{ restaurant.averageRating.toFixed(1) }}</span>
                  </div>
                  <span class="text-lg opacity-90">({{ restaurant.totalReviews }} reviews)</span>
                </div>
                
                <div class="flex flex-wrap items-center gap-4">
                  <mat-chip class="text-lg bg-accent-100 text-accent-800">
                    {{ restaurant.priceRange }}
                  </mat-chip>
                  <div class="flex items-center gap-2 opacity-90">
                    <mat-icon>location_on</mat-icon>
                    <span>{{ restaurant.address }}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col gap-3">
                <button mat-raised-button 
                        color="accent" 
                        class="flex items-center gap-2 px-6 py-3 text-lg">
                  <mat-icon>favorite</mat-icon>
                  Add to Favorites
                </button>
                <button mat-stroked-button 
                        class="flex items-center gap-2 px-6 py-3 text-lg border-white text-white hover:bg-white hover:text-primary-700">
                  <mat-icon>share</mat-icon>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Restaurant Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Restaurant Details -->
            <mat-card class="p-6">
              <div class="flex items-center gap-3 mb-6">
                <mat-icon class="text-primary-600">info</mat-icon>
                <h2 class="text-2xl font-semibold text-gray-900">Restaurant Details</h2>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <mat-icon class="text-gray-500 mt-1">location_on</mat-icon>
                  <div>
                    <p class="font-medium text-gray-900">Address</p>
                    <p class="text-gray-600">{{ restaurant.address }}</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3" *ngIf="restaurant.phone">
                  <mat-icon class="text-gray-500 mt-1">phone</mat-icon>
                  <div>
                    <p class="font-medium text-gray-900">Phone</p>
                    <a [href]="'tel:' + restaurant.phone" 
                       class="text-primary-600 hover:text-primary-700 transition-colors">
                      {{ restaurant.phone }}
                    </a>
                  </div>
                </div>
                
                <div class="flex items-start gap-3" *ngIf="restaurant.website">
                  <mat-icon class="text-gray-500 mt-1">language</mat-icon>
                  <div>
                    <p class="font-medium text-gray-900">Website</p>
                    <a [href]="restaurant.website" 
                       target="_blank" 
                       class="text-primary-600 hover:text-primary-700 transition-colors">
                      {{ restaurant.website }}
                    </a>
                  </div>
                </div>
              </div>
            </mat-card>

            <!-- Features -->
            <mat-card class="p-6" *ngIf="restaurant.features?.length">
              <div class="flex items-center gap-3 mb-6">
                <mat-icon class="text-primary-600">star</mat-icon>
                <h2 class="text-2xl font-semibold text-gray-900">Features & Amenities</h2>
              </div>
              
              <div class="flex flex-wrap gap-2">
                <mat-chip *ngFor="let feature of restaurant.features" 
                         class="text-sm bg-primary-100 text-primary-800">
                  {{ feature }}
                </mat-chip>
              </div>
            </mat-card>

            <!-- Hours of Operation -->
            <mat-card class="p-6" *ngIf="restaurant.hours">
              <div class="flex items-center gap-3 mb-6">
                <mat-icon class="text-primary-600">schedule</mat-icon>
                <h2 class="text-2xl font-semibold text-gray-900">Hours of Operation</h2>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex justify-between items-center py-2 border-b border-gray-200" 
                     *ngFor="let day of getDays()">
                  <span class="font-medium text-gray-900">{{ day }}</span>
                  <span class="text-gray-600">{{ restaurant.hours[day] || 'Closed' }}</span>
                </div>
              </div>
            </mat-card>

            <!-- Reviews Section -->
            <mat-card class="p-6">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <mat-icon class="text-primary-600">rate_review</mat-icon>
                  <h2 class="text-2xl font-semibold text-gray-900">Reviews</h2>
                </div>
                <button mat-raised-button 
                        color="primary" 
                        class="flex items-center gap-2">
                  <mat-icon>add</mat-icon>
                  Write Review
                </button>
              </div>
              
              <div class="space-y-6" *ngIf="reviews$ | async as reviews; else noReviews">
                <div class="border border-gray-200 rounded-lg p-6" 
                     *ngFor="let review of reviews; trackBy: trackByReview">
                  <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                        <mat-icon class="text-primary-700">{{ review.userName.charAt(0).toUpperCase() }}</mat-icon>
                      </div>
                      <div>
                        <p class="font-semibold text-gray-900">{{ review.userName }}</p>
                        <p class="text-sm text-gray-500">{{ review.date | date:'mediumDate' }}</p>
                      </div>
                    </div>
                    <app-rating [rating]="review.rating" [readonly]="true"></app-rating>
                  </div>
                  
                  <p class="text-gray-700 leading-relaxed mb-4">{{ review.comment }}</p>
                  
                  <div class="flex items-center gap-4">
                    <button mat-button 
                            class="flex items-center gap-2 text-gray-600 hover:text-primary-700"
                            matTooltip="Mark as helpful">
                      <mat-icon>thumb_up</mat-icon>
                      Helpful ({{ review.helpful }})
                    </button>
                    <button mat-button 
                            class="flex items-center gap-2 text-gray-600 hover:text-primary-700"
                            matTooltip="Reply to review">
                      <mat-icon>reply</mat-icon>
                      Reply
                    </button>
                  </div>
                </div>
              </div>
              
              <ng-template #noReviews>
                <div class="text-center py-12">
                  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <mat-icon class="text-gray-400 text-2xl">rate_review</mat-icon>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                  <p class="text-gray-600 mb-6">Be the first to review this restaurant!</p>
                  <button mat-raised-button 
                          color="primary" 
                          class="flex items-center gap-2 mx-auto">
                    <mat-icon>add</mat-icon>
                    Write First Review
                  </button>
                </div>
              </ng-template>
            </mat-card>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Quick Actions -->
            <mat-card class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <button mat-stroked-button 
                        class="w-full flex items-center gap-2 justify-start"
                        matTooltip="Get directions">
                  <mat-icon>directions</mat-icon>
                  Get Directions
                </button>
                <button mat-stroked-button 
                        class="w-full flex items-center gap-2 justify-start"
                        matTooltip="Call restaurant"
                        *ngIf="restaurant.phone">
                  <mat-icon>phone</mat-icon>
                  Call Restaurant
                </button>
                <button mat-stroked-button 
                        class="w-full flex items-center gap-2 justify-start"
                        matTooltip="Visit website"
                        *ngIf="restaurant.website">
                  <mat-icon>language</mat-icon>
                  Visit Website
                </button>
              </div>
            </mat-card>

            <!-- Restaurant Stats -->
            <mat-card class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Restaurant Stats</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Average Rating</span>
                  <span class="font-semibold text-gray-900">{{ restaurant.averageRating.toFixed(1) }}/5</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Total Reviews</span>
                  <span class="font-semibold text-gray-900">{{ restaurant.totalReviews }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Price Range</span>
                  <span class="font-semibold text-gray-900">{{ restaurant.priceRange }}</span>
                </div>
              </div>
            </mat-card>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="flex flex-col items-center justify-center py-20">
        <mat-spinner diameter="40" class="mb-4"></mat-spinner>
        <p class="text-gray-600">Loading restaurant details...</p>
      </div>
    </ng-template>
  `,
  styles: []
})
export class RestaurantDetailComponent implements OnInit {
  restaurant$: Observable<Restaurant | null>;
  reviews$: Observable<Review[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantService,
    private snackBar: MatSnackBar
  ) {
    this.restaurant$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.restaurantService.getRestaurant(id)),
      catchError(error => {
        console.error('Error loading restaurant:', error);
        this.snackBar.open('Error loading restaurant details', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-state']
        });
        this.router.navigate(['/restaurants']);
        return of(null);
      })
    );

    this.reviews$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.restaurantService.getRestaurantReviews(id)),
      catchError(error => {
        console.error('Error loading reviews:', error);
        return of([]);
      })
    );
  }

  ngOnInit(): void {}

  getDays(): string[] {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  }

  trackByReview(index: number, review: Review): string {
    return review.id || index.toString();
  }
} 