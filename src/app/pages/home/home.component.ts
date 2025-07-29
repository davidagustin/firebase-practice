import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    MatRippleModule,
    MatSnackBarModule,
    FormsModule
  ],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 -mt-6 -mx-6 mb-12 sm:mb-16 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-white/10"></div>
      </div>
      
      <div class="relative max-w-6xl mx-auto text-center">
        <div class="animate-fade-in">
          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-light mb-4 sm:mb-6 leading-tight text-balance">
            Discover Amazing
            <span class="font-semibold bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              Restaurants
            </span>
          </h1>
          <p class="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 opacity-90 leading-relaxed max-w-3xl mx-auto text-balance px-4">
            Find the best places to eat, read authentic reviews, and share your dining experiences with our community
          </p>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto px-4">
            <mat-form-field appearance="outline" class="w-full hero-search">
              <mat-label class="text-white">Search restaurants...</mat-label>
              <input 
                matInput 
                [(ngModel)]="searchTerm" 
                placeholder="Name, cuisine, or location"
                (keyup.enter)="onSearch()"
                (keyup)="onSearchInput()"
                class="text-gray-900 bg-white"
                aria-label="Search restaurants">
              <mat-icon matSuffix class="text-gray-500">search</mat-icon>
              <button 
                matSuffix 
                mat-icon-button 
                (click)="onSearch()"
                [disabled]="!searchTerm.trim()"
                matTooltip="Search restaurants"
                class="text-primary-600 hover:text-primary-700">
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-form-field>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Restaurants -->
    <section class="mb-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-light text-gray-900 mb-3">Featured Restaurants</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">Top-rated places loved by our community</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" 
           *ngIf="topRestaurants$ | async as restaurants; else loading">
        <mat-card class="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-large h-full group" 
                  *ngFor="let restaurant of restaurants; trackBy: trackByRestaurant" 
                  [routerLink]="['/restaurant', restaurant.id]"
                  [attr.aria-label]="'View details for ' + restaurant.name"
                  matRipple>
          <div class="relative h-48 overflow-hidden rounded-t-xl">
            <img [src]="restaurant.images[0] || 'assets/default-restaurant.jpg'" 
                 [alt]="restaurant.name"
                 (error)="$event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDEzMCAxMDBDMTMwIDExNi41NjkgMTE2LjU2OSAxMzAgMTAwIDEzMEM4My40MzEgMTMwIDcwIDExNi41NjkgNzAgMTAwQzcwIDgzLjQzMSA4My40MzEgNzAgMTAwIDcwWiIgZmlsbD0iIzlDQTBBNiIvPgo8cGF0aCBkPSJNMTAwIDE0MEMxMTYuNTY5IDE0MCAxMzAgMTUzLjQzMSAxMzAgMTcwQzEzMCAxODYuNTY5IDExNi41NjkgMjAwIDEwMCAyMDBDODMuNDMxIDIwMCA3MCAxODYuNTY5IDcwIDE3MEM3MCAxNTMuNDMxIDgzLjQzMSAxNDAgMTAwIDE0MFoiIGZpbGw9IiM5Q0EwQTYiLz4KPC9zdmc+'"
                 class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div class="absolute top-3 right-3">
              <div class="flex gap-1">
                <mat-chip class="text-xs bg-primary-600 text-white font-medium shadow-sm">
                  {{ restaurant.cuisine }}
                </mat-chip>
                <mat-chip class="text-xs bg-accent-600 text-white font-medium shadow-sm">
                  {{ restaurant.priceRange }}
                </mat-chip>
              </div>
            </div>
            <div class="absolute bottom-3 left-3">
              <div class="flex items-center bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                <div class="flex items-center">
                  <mat-icon *ngFor="let star of getStars(restaurant.averageRating)" 
                            [class.text-yellow-500]="star === 'star' || star === 'star_half'"
                            [class.text-gray-300]="star === 'star_border'"
                            class="text-sm">
                    {{ star }}
                  </mat-icon>
                </div>
                <span class="text-sm font-medium text-gray-800 ml-1">
                  {{ restaurant.averageRating.toFixed(1) }}
                </span>
              </div>
            </div>
          </div>
          
          <mat-card-content class="p-4">
            <h3 class="text-xl font-semibold mb-2 text-gray-900 group-hover:text-primary-700 transition-colors">
              {{ restaurant.name }}
            </h3>
            <p class="flex items-center text-gray-600 text-sm mb-3">
              <mat-icon class="text-base mr-1 text-gray-500">location_on</mat-icon>
              {{ restaurant.address }}
            </p>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">
                {{ restaurant.totalReviews }} reviews
              </span>
              <span class="text-sm font-medium text-primary-600">
                View Details →
              </span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <ng-template #loading>
        <div class="flex flex-col items-center py-16">
          <mat-spinner diameter="40" class="mb-4"></mat-spinner>
          <p class="text-gray-600">Loading featured restaurants...</p>
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <div *ngFor="let i of [1,2,3,4,5,6]" class="bg-white rounded-xl shadow-soft overflow-hidden">
              <div class="h-48 loading-skeleton"></div>
              <div class="p-4 space-y-3">
                <div class="h-6 loading-skeleton rounded"></div>
                <div class="h-4 loading-skeleton rounded w-3/4"></div>
                <div class="h-4 loading-skeleton rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </ng-template>
      
      <div class="text-center">
        <button mat-raised-button 
                color="primary" 
                routerLink="/restaurants" 
                class="flex items-center gap-2 mx-auto px-8 py-3 text-lg">
          <mat-icon>restaurant_menu</mat-icon>
          View All Restaurants
        </button>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="mb-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-light text-gray-900 mb-3">Browse by Cuisine</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">Find restaurants by your favorite cuisine</p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <mat-card class="text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-large group" 
                  *ngFor="let category of categories; trackBy: trackByCategory" 
                  [routerLink]="['/restaurants']" 
                  [queryParams]="{cuisine: category.name}"
                  matRipple>
          <mat-card-content class="p-8">
            <div class="mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
                <mat-icon class="text-3xl text-primary-700">{{ category.icon }}</mat-icon>
              </div>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-gray-900 group-hover:text-primary-700 transition-colors">
              {{ category.name }}
            </h3>
            <p class="text-gray-600">{{ category.description }}</p>
          </mat-card-content>
        </mat-card>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="mb-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-light text-gray-900 mb-3">How It Works</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">Get started with FoodRater in three simple steps</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center p-8 bg-white rounded-2xl shadow-soft relative group hover:shadow-medium transition-all duration-300">
          <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
            1
          </div>
          <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
            <mat-icon class="text-3xl text-primary-700">search</mat-icon>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-900">Search</h3>
          <p class="text-gray-600 leading-relaxed">Find restaurants by name, cuisine, or location</p>
        </div>
        
        <div class="text-center p-8 bg-white rounded-2xl shadow-soft relative group hover:shadow-medium transition-all duration-300">
          <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
            2
          </div>
          <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
            <mat-icon class="text-3xl text-primary-700">rate_review</mat-icon>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-900">Rate & Review</h3>
          <p class="text-gray-600 leading-relaxed">Share your dining experience with ratings and reviews</p>
        </div>
        
        <div class="text-center p-8 bg-white rounded-2xl shadow-soft relative group hover:shadow-medium transition-all duration-300">
          <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
            3
          </div>
          <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
            <mat-icon class="text-3xl text-primary-700">favorite</mat-icon>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-900">Save Favorites</h3>
          <p class="text-gray-600 leading-relaxed">Save your favorite restaurants for quick access</p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-gradient-to-br from-gray-50 to-gray-100 -mx-6 -mb-6 px-6 py-16">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        <div class="text-center group">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
            <mat-icon class="text-3xl text-primary-700">restaurant</mat-icon>
          </div>
          <h3 class="text-3xl md:text-4xl font-light text-primary-700 mb-2">500+</h3>
          <p class="text-lg text-gray-600">Restaurants</p>
        </div>
        
        <div class="text-center group">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
            <mat-icon class="text-3xl text-primary-700">people</mat-icon>
          </div>
          <h3 class="text-3xl md:text-4xl font-light text-primary-700 mb-2">10K+</h3>
          <p class="text-lg text-gray-600">Reviews</p>
        </div>
        
        <div class="text-center group">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
            <mat-icon class="text-3xl text-primary-700">star</mat-icon>
          </div>
          <h3 class="text-3xl md:text-4xl font-light text-primary-700 mb-2">4.5</h3>
          <p class="text-lg text-gray-600">Average Rating</p>
        </div>
        
        <div class="text-center group">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
            <mat-icon class="text-3xl text-primary-700">favorite</mat-icon>
          </div>
          <h3 class="text-3xl md:text-4xl font-light text-primary-700 mb-2">50K+</h3>
          <p class="text-lg text-gray-600">Happy Users</p>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  private restaurantService = inject(RestaurantService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  searchTerm = '';
  topRestaurants$!: Observable<Restaurant[]>;
  
  categories = [
    { name: 'Italian', icon: 'restaurant', description: 'Pizza, pasta, and more' },
    { name: 'Asian', icon: 'ramen_dining', description: 'Sushi, noodles, and stir-fry' },
    { name: 'American', icon: 'fastfood', description: 'Burgers, BBQ, and comfort food' },
    { name: 'Mexican', icon: 'local_dining', description: 'Tacos, burritos, and authentic flavors' },
    { name: 'French', icon: 'wine_bar', description: 'Fine dining and classic cuisine' },
    { name: 'Indian', icon: 'local_cafe', description: 'Curries, naan, and aromatic spices' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.topRestaurants$ = this.restaurantService.getTopRatedRestaurants(6).pipe(
      map(restaurants => this.removeDuplicates(restaurants)),
      catchError(error => {
        console.error('Error loading top restaurants:', error);
        this.snackBar.open('Error loading featured restaurants', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-state']
        });
        return of([]);
      })
    );
  }

  private removeDuplicates(restaurants: Restaurant[]): Restaurant[] {
    const seen = new Set();
    return restaurants.filter(restaurant => {
      const key = restaurant.name.toLowerCase().trim();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/restaurants'], {
        queryParams: { search: this.searchTerm.trim() }
      });
    }
  }

  onSearchInput(): void {
    // Debounced search could be implemented here
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }
    
    if (hasHalfStar) {
      stars.push('star_half');
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push('star_border');
    }
    
    return stars;
  }

  trackByRestaurant(index: number, restaurant: Restaurant): string {
    return restaurant.id || index.toString();
  }

  trackByCategory(index: number, category: any): string {
    return category.name;
  }
} 