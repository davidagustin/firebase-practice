import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';
import { Observable, Subject, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, takeUntil, catchError } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurants',
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
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatListModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatRippleModule,
    FormsModule
  ],
  template: `
    <!-- Header Section -->
    <div class="bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6 -mt-6 -mx-6 mb-8">
      <div class="max-w-7xl mx-auto">
        <div class="animate-fade-in">
          <h1 class="text-3xl md:text-4xl font-light text-gray-900 mb-4">Restaurants</h1>
          <p class="text-lg text-gray-600 mb-8 max-w-2xl">Discover amazing places to eat in your area</p>
          
          <!-- Search and Filters -->
          <div class="flex flex-col gap-6">
            <!-- Search Bar -->
            <mat-form-field appearance="outline" class="w-full max-w-2xl">
              <mat-label>Search restaurants...</mat-label>
              <input 
                matInput 
                [(ngModel)]="searchTerm" 
                placeholder="Name, cuisine, or location"
                (input)="onSearchTermChange($event.target.value)">
              <mat-icon matSuffix class="text-gray-500">search</mat-icon>
            </mat-form-field>
            
            <!-- Filters Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Cuisine</mat-label>
                <mat-select [(ngModel)]="selectedCuisine" (selectionChange)="onCuisineChange($event.value)">
                  <mat-option value="">All Cuisines</mat-option>
                  <mat-option *ngFor="let cuisine of cuisines" [value]="cuisine">
                    {{ cuisine }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Price Range</mat-label>
                <mat-select [(ngModel)]="selectedPriceRange" (selectionChange)="onPriceRangeChange($event.value)">
                  <mat-option value="">All Prices</mat-option>
                  <mat-option value="Budget">Budget</mat-option>
                  <mat-option value="Moderate">Moderate</mat-option>
                  <mat-option value="Expensive">Expensive</mat-option>
                  <mat-option value="Luxury">Luxury</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Sort By</mat-label>
                <mat-select [(ngModel)]="sortBy" (selectionChange)="onSortByChange($event.value)">
                  <mat-option value="rating">Rating (High to Low)</mat-option>
                  <mat-option value="name">Name (A-Z)</mat-option>
                  <mat-option value="reviews">Most Reviews</mat-option>
                  <mat-option value="price">Price (Low to High)</mat-option>
                </mat-select>
              </mat-form-field>
              
              <div class="flex items-center gap-2">
                <button mat-icon-button 
                        [class.bg-primary-50]="viewMode === 'grid'" 
                        [class.text-primary-700]="viewMode === 'grid'" 
                        (click)="viewMode = 'grid'"
                        matTooltip="Grid view"
                        class="hover:bg-gray-100">
                  <mat-icon>grid_view</mat-icon>
                </button>
                <button mat-icon-button 
                        [class.bg-primary-50]="viewMode === 'list'" 
                        [class.text-primary-700]="viewMode === 'list'" 
                        (click)="viewMode = 'list'"
                        matTooltip="List view"
                        class="hover:bg-gray-100">
                  <mat-icon>view_list</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 px-2 gap-4">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">
            {{ (filteredRestaurants$ | async)?.length || 0 }} Restaurants Found
          </h2>
          <div class="flex flex-wrap gap-2 mt-2" *ngIf="searchTerm || selectedCuisine || selectedPriceRange">
            <span class="text-sm text-gray-600">Filtered by:</span>
            <span *ngIf="searchTerm" 
                  class="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
              {{ searchTerm }}
            </span>
            <span *ngIf="selectedCuisine" 
                  class="bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm font-medium">
              {{ selectedCuisine }}
            </span>
            <span *ngIf="selectedPriceRange" 
                  class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {{ selectedPriceRange }}
            </span>
          </div>
        </div>
        
        <button mat-button 
                (click)="clearFilters()" 
                class="flex items-center gap-2 text-gray-600 hover:text-primary-700"
                *ngIf="searchTerm || selectedCuisine || selectedPriceRange">
          <mat-icon>clear</mat-icon>
          Clear Filters
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="(filteredRestaurants$ | async) === null" class="flex flex-col items-center py-16">
        <mat-spinner diameter="40" class="mb-4"></mat-spinner>
        <p class="text-gray-600">Loading restaurants...</p>
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

      <!-- No Results -->
      <div *ngIf="(filteredRestaurants$ | async)?.length === 0" class="flex flex-col items-center py-16 text-center">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <mat-icon class="text-4xl text-gray-400">restaurant</mat-icon>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
        <p class="text-gray-600 mb-6 max-w-md">Try adjusting your search criteria or filters to find what you're looking for</p>
        <button mat-raised-button 
                color="primary" 
                (click)="clearFilters()" 
                class="flex items-center gap-2">
          <mat-icon>clear</mat-icon>
          Clear All Filters
        </button>
      </div>

      <!-- Grid View -->
      <div *ngIf="viewMode === 'grid' && (filteredRestaurants$ | async)?.length" 
           class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <mat-card class="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-large h-full group" 
                  *ngFor="let restaurant of filteredRestaurants$ | async; trackBy: trackByRestaurant" 
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
                <mat-chip class="text-xs bg-primary-100 text-primary-800">
                  {{ restaurant.cuisine }}
                </mat-chip>
                <mat-chip class="text-xs bg-accent-100 text-accent-800">
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
            
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-gray-600">
                {{ restaurant.totalReviews }} reviews
              </span>
              <span class="text-sm font-medium text-primary-600">
                View Details →
              </span>
            </div>
            
            <div class="flex flex-wrap gap-2" *ngIf="restaurant.features?.length">
              <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium" 
                    *ngFor="let feature of restaurant.features?.slice(0, 3)">
                {{ feature }}
              </span>
            </div>
          </mat-card-content>
          
          <mat-card-actions class="p-4 pt-0">
            <button mat-button 
                    color="primary" 
                    (click)="addToFavorites(restaurant); $event.stopPropagation()" 
                    class="flex items-center gap-1"
                    matTooltip="Add to favorites">
              <mat-icon>favorite_border</mat-icon>
              Add to Favorites
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- List View -->
      <div *ngIf="viewMode === 'list' && (filteredRestaurants$ | async)?.length" 
           class="flex flex-col gap-4">
        <mat-card class="cursor-pointer transition-all duration-300 hover:shadow-medium group" 
                  *ngFor="let restaurant of filteredRestaurants$ | async; trackBy: trackByRestaurant" 
                  [routerLink]="['/restaurant', restaurant.id]"
                  [attr.aria-label]="'View details for ' + restaurant.name"
                  matRipple>
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
            <div class="w-full sm:w-32 h-32 sm:h-20 overflow-hidden rounded-xl flex-shrink-0">
              <img [src]="restaurant.images[0] || 'assets/default-restaurant.jpg'" 
                   [alt]="restaurant.name"
                   (error)="$event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDEzMCAxMDBDMTMwIDExNi41NjkgMTE2LjU2OSAxMzAgMTAwIDEzMEM4My40MzEgMTMwIDcwIDExNi41NjkgNzAgMTAwQzcwIDgzLjQzMSA4My40MzEgNzAgMTAwIDcwWiIgZmlsbD0iIzlDQTBBNiIvPgo8cGF0aCBkPSJNMTAwIDE0MEMxMTYuNTY5IDE0MCAxMzAgMTUzLjQzMSAxMzAgMTcwQzEzMCAxODYuNTY5IDExNi41NjkgMjAwIDEwMCAyMDBDODMuNDMxIDIwMCA3MCAxODYuNTY5IDcwIDE3MEM3MCAxNTMuNDMxIDgzLjQzMSAxNDAgMTAwIDE0MFoiIGZpbGw9IiM5Q0EwQTYiLz4KPC9zdmc+'"
                   class="w-full h-full object-cover">
            </div>
            
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold mb-1 text-gray-900 group-hover:text-primary-700 transition-colors">
                {{ restaurant.name }}
              </h3>
              <p class="flex items-center text-gray-600 text-sm mb-2">
                <mat-icon class="text-base mr-1 text-gray-500">location_on</mat-icon>
                {{ restaurant.address }}
              </p>
              
              <div class="flex items-center gap-2 mb-2">
                <div class="flex items-center">
                  <mat-icon *ngFor="let star of getStars(restaurant.averageRating)" 
                            [class.text-yellow-500]="star === 'star' || star === 'star_half'"
                            [class.text-gray-300]="star === 'star_border'"
                            class="text-base">
                    {{ star }}
                  </mat-icon>
                </div>
                <span class="text-sm text-gray-600">
                  {{ restaurant.averageRating.toFixed(1) }} ({{ restaurant.totalReviews }} reviews)
                </span>
              </div>
              
              <div class="flex flex-wrap gap-2">
                <mat-chip class="text-xs bg-primary-50 text-primary-800 border border-primary-200">{{ restaurant.cuisine }}</mat-chip>
                <mat-chip class="text-xs bg-accent-50 text-accent-800 border border-accent-200">{{ restaurant.priceRange }}</mat-chip>
                <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium" 
                      *ngFor="let feature of restaurant.features?.slice(0, 2)">
                  {{ feature }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <button mat-icon-button 
                      (click)="addToFavorites(restaurant); $event.stopPropagation()"
                      matTooltip="Add to favorites"
                      class="text-gray-600 hover:text-red-500">
                <mat-icon>favorite_border</mat-icon>
              </button>
              <button mat-raised-button 
                      color="primary" 
                      (click)="$event.stopPropagation()"
                      class="flex items-center gap-1">
                <mat-icon>visibility</mat-icon>
                View Details
              </button>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: []
})
export class RestaurantsComponent implements OnInit, OnDestroy {
  private restaurantService = inject(RestaurantService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  searchTerm = '';
  selectedCuisine = '';
  selectedPriceRange = '';
  sortBy = 'rating';
  viewMode: 'grid' | 'list' = 'grid';
  
  restaurants$!: Observable<Restaurant[]>;
  filteredRestaurants$!: Observable<Restaurant[]>;
  
  private searchTermSubject = new BehaviorSubject<string>('');
  private cuisineSubject = new BehaviorSubject<string>('');
  private priceRangeSubject = new BehaviorSubject<string>('');
  private sortBySubject = new BehaviorSubject<string>('rating');
  private destroy$ = new Subject<void>();

  cuisines = [
    'Italian', 'Asian', 'American', 'Mexican', 'French', 'Indian', 
    'Japanese', 'Chinese', 'Thai', 'Vietnamese', 'Mediterranean'
  ];

  constructor() {
    this.restaurants$ = this.restaurantService.getRestaurants();
    this.setupFilteredRestaurants();
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
        this.searchTermSubject.next(this.searchTerm);
      }
      if (params['cuisine']) {
        this.selectedCuisine = params['cuisine'];
        this.cuisineSubject.next(this.selectedCuisine);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFilteredRestaurants(): void {
    this.restaurants$ = this.restaurantService.getRestaurants().pipe(
      catchError(error => {
        console.error('Error loading restaurants:', error);
        this.snackBar.open('Error loading restaurants. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-state']
        });
        return of([]);
      })
    );

    this.filteredRestaurants$ = combineLatest([
      this.restaurants$,
      this.searchTermSubject.asObservable().pipe(
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.cuisineSubject.asObservable(),
      this.priceRangeSubject.asObservable(),
      this.sortBySubject.asObservable()
    ]).pipe(
      map(([restaurants, searchTerm, cuisine, priceRange, sortBy]) => {
        const uniqueRestaurants = this.removeDuplicates(restaurants);
        let filtered = uniqueRestaurants;

        // Apply search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filtered = filtered.filter(restaurant =>
            restaurant.name.toLowerCase().includes(searchLower) ||
            restaurant.cuisine.toLowerCase().includes(searchLower) ||
            restaurant.address.toLowerCase().includes(searchLower)
          );
        }

        // Apply cuisine filter
        if (cuisine) {
          filtered = filtered.filter(restaurant => 
            restaurant.cuisine === cuisine
          );
        }

        // Apply price range filter
        if (priceRange) {
          filtered = filtered.filter(restaurant => 
            restaurant.priceRange === priceRange
          );
        }

        // Apply sorting
        filtered = this.sortRestaurants(filtered, sortBy);

        return filtered;
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

  private sortRestaurants(restaurants: Restaurant[], sortBy: string): Restaurant[] {
    switch (sortBy) {
      case 'rating':
        return restaurants.sort((a, b) => b.averageRating - a.averageRating);
      case 'name':
        return restaurants.sort((a, b) => a.name.localeCompare(b.name));
      case 'reviews':
        return restaurants.sort((a, b) => b.totalReviews - a.totalReviews);
      case 'price':
        const priceOrder = { 'Budget': 1, 'Moderate': 2, 'Expensive': 3, 'Luxury': 4 };
        return restaurants.sort((a, b) => 
          (priceOrder[a.priceRange as keyof typeof priceOrder] || 0) - 
          (priceOrder[b.priceRange as keyof typeof priceOrder] || 0)
        );
      default:
        return restaurants;
    }
  }

  onSearchTermChange(value: string): void {
    this.searchTermSubject.next(value);
  }

  onCuisineChange(value: string): void {
    this.cuisineSubject.next(value);
  }

  onPriceRangeChange(value: string): void {
    this.priceRangeSubject.next(value);
  }

  onSortByChange(value: string): void {
    this.sortBySubject.next(value);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCuisine = '';
    this.selectedPriceRange = '';
    this.searchTermSubject.next('');
    this.cuisineSubject.next('');
    this.priceRangeSubject.next('');
  }

  addToFavorites(restaurant: Restaurant): void {
    this.snackBar.open(`${restaurant.name} added to favorites!`, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-state']
    });
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
} 