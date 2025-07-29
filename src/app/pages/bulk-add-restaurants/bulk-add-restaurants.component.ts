import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';

@Component({
  selector: 'app-bulk-add-restaurants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: `
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="animate-fade-in">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <mat-icon class="text-white text-2xl">add_business</mat-icon>
          </div>
          <h1 class="text-3xl md:text-4xl font-light text-gray-900 mb-3">Bulk Add Restaurants</h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">Add 100 diverse restaurants to populate your database with sample data</p>
        </div>

        <!-- Main Card -->
        <mat-card class="p-8 shadow-large">
          <!-- Back to Restaurants Link -->
          <div class="mb-6">
            <button type="button" mat-button routerLink="/restaurants" class="text-gray-600 hover:text-primary-700">
              <mat-icon class="mr-2">arrow_back</mat-icon>
              Back to Restaurants
            </button>
          </div>

          <!-- Progress Section -->
          <div *ngIf="isAdding" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Adding Restaurants...</h2>
              <span class="text-sm text-gray-600">{{ addedCount }} / {{ totalToAdd }}</span>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div class="bg-primary-600 h-4 rounded-full transition-all duration-300"
                   [style.width.%]="(addedCount / totalToAdd) * 100"></div>
            </div>
            
            <p class="text-sm text-gray-600 mb-4">
              Currently adding: <span class="font-medium">{{ currentRestaurant?.name }}</span>
            </p>
            
            <div class="flex items-center space-x-2">
              <mat-spinner diameter="20"></mat-spinner>
              <span class="text-sm text-gray-600">Please wait, this may take a few minutes...</span>
            </div>
          </div>

          <!-- Control Section -->
          <div *ngIf="!isAdding" class="space-y-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start space-x-3">
                <mat-icon class="text-blue-500 mt-0.5">info</mat-icon>
                <div>
                  <h3 class="text-blue-800 font-medium">What will be added:</h3>
                  <ul class="text-blue-700 text-sm mt-2 space-y-1">
                    <li>• 100 diverse restaurants with realistic data</li>
                    <li>• Various cuisines: Italian, Japanese, Chinese, Mexican, Indian, Thai, and more</li>
                    <li>• Different price ranges: Budget, Moderate, Expensive, Luxury</li>
                    <li>• Realistic ratings (3.0 - 5.0) and review counts</li>
                    <li>• Complete business hours and features</li>
                    <li>• Random addresses across different neighborhoods</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <button 
                type="button" 
                mat-raised-button 
                color="primary" 
                class="flex items-center gap-2 px-8 py-3"
                (click)="startBulkAdd()"
                [disabled]="isAdding">
                <mat-icon>add_business</mat-icon>
                Add 100 Restaurants
              </button>
              
              <button 
                type="button" 
                mat-button 
                routerLink="/restaurants"
                class="flex items-center gap-2">
                <mat-icon>list</mat-icon>
                View All Restaurants
              </button>
            </div>
          </div>

          <!-- Results Section -->
          <div *ngIf="results.length > 0" class="mt-8">
            <mat-divider class="mb-6"></mat-divider>
            
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Results</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-center space-x-2">
                  <mat-icon class="text-green-500">check_circle</mat-icon>
                  <span class="font-medium text-green-800">Successfully Added</span>
                </div>
                <p class="text-green-700 text-sm mt-1">{{ successCount }} restaurants</p>
              </div>
              
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex items-center space-x-2">
                  <mat-icon class="text-red-500">error</mat-icon>
                  <span class="font-medium text-red-800">Failed to Add</span>
                </div>
                <p class="text-red-700 text-sm mt-1">{{ errorCount }} restaurants</p>
              </div>
            </div>

            <!-- Recent Additions -->
            <div *ngIf="recentAdditions.length > 0" class="mt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-3">Recently Added:</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div *ngFor="let restaurant of recentAdditions.slice(0, 9)" 
                     class="bg-gray-50 rounded-lg p-3 border">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-900 text-sm">{{ restaurant.name }}</p>
                      <p class="text-gray-600 text-xs">{{ restaurant.cuisine }}</p>
                    </div>
                    <mat-chip class="text-xs" 
                             [class]="getPriceRangeClass(restaurant.priceRange)">
                      {{ restaurant.priceRange }}
                    </mat-chip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: []
})
export class BulkAddRestaurantsComponent implements OnInit {
  isAdding = false;
  addedCount = 0;
  totalToAdd = 100;
  currentRestaurant: Restaurant | null = null;
  results: { success: boolean; restaurant: Restaurant; error?: string }[] = [];
  successCount = 0;
  errorCount = 0;
  recentAdditions: Restaurant[] = [];

  constructor(
    private restaurantService: RestaurantService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  startBulkAdd(): void {
    this.isAdding = true;
    this.addedCount = 0;
    this.results = [];
    this.successCount = 0;
    this.errorCount = 0;
    this.recentAdditions = [];

    const restaurants = this.generateRestaurants();
    
    this.addRestaurantsSequentially(restaurants, 0);
  }

  private addRestaurantsSequentially(restaurants: Restaurant[], index: number): void {
    if (index >= restaurants.length) {
      this.isAdding = false;
      this.showCompletionMessage();
      return;
    }

    const restaurant = restaurants[index];
    this.currentRestaurant = restaurant;
    this.addedCount = index;

    this.restaurantService.addRestaurant(restaurant).subscribe({
      next: (id) => {
        const addedRestaurant = { ...restaurant, id };
        this.results.push({ success: true, restaurant: addedRestaurant });
        this.successCount++;
        this.recentAdditions.unshift(addedRestaurant);
        
        // Continue with next restaurant
        setTimeout(() => {
          this.addRestaurantsSequentially(restaurants, index + 1);
        }, 200); // Small delay to avoid overwhelming the database
      },
      error: (error) => {
        this.results.push({ 
          success: false, 
          restaurant, 
          error: error.message 
        });
        this.errorCount++;
        
        // Continue with next restaurant even if this one failed
        setTimeout(() => {
          this.addRestaurantsSequentially(restaurants, index + 1);
        }, 200);
      }
    });
  }

  private showCompletionMessage(): void {
    const message = `Bulk add completed! Successfully added ${this.successCount} restaurants.`;
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-state']
    });
  }

  getPriceRangeClass(priceRange: string): string {
    switch (priceRange) {
      case 'Budget': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-blue-100 text-blue-800';
      case 'Expensive': return 'bg-orange-100 text-orange-800';
      case 'Luxury': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  private generateRestaurants(): Restaurant[] {
    const restaurantNames = [
      "The Golden Fork", "Spice Route", "Ocean's Bounty", "Mountain View", "Urban Kitchen",
      "Riverside Cafe", "Sunset Grill", "Moonlight Bistro", "Starlight Diner", "Coastal Kitchen",
      "Harbor House", "Garden Terrace", "Skyline Restaurant", "Valley View", "Peak Dining",
      "Lakeside Lodge", "Forest Feast", "Desert Rose", "Alpine Lodge", "Seaside Shack",
      "Downtown Delight", "Uptown Eats", "Midtown Munchies", "Westside Wok", "Eastside Eats",
      "Northside Nosh", "Southside Sizzle", "Central Station", "The Corner Cafe", "Main Street Grill",
      "Oak Avenue Kitchen", "Pine Street Pub", "Elm Street Eatery", "Maple Drive Diner", "Cedar Lane Cafe",
      "Birch Road Bistro", "Willow Way Wok", "Spruce Street Sushi", "Ash Avenue Asian", "Poplar Place Pizza",
      "Sycamore Street Steakhouse", "Magnolia Mansion", "Juniper Junction", "Cypress Corner", "Redwood Retreat",
      "Sequoia Station", "Palm Tree Palace", "Bamboo Garden", "Cherry Blossom", "Lotus Leaf",
      "Golden Lotus", "Silver Dragon", "Jade Palace", "Ruby Red", "Emerald Isle",
      "Sapphire Blue", "Diamond Cut", "Platinum Plate", "Copper Kettle", "Iron Chef",
      "Steel Pan", "Brass Ring", "Bronze Age", "Silver Spoon", "Golden Plate",
      "Crystal Clear", "Pearl Harbor", "Coral Reef", "Amber Alert", "Onyx Black",
      "Ivory Tower", "Ebony Wood", "Mahogany Manor", "Teak Table", "Walnut Wall",
      "Chestnut Corner", "Hazelnut House", "Almond Avenue", "Pecan Place", "Cashew Corner",
      "Pistachio Palace", "Macadamia Manor", "Brazilian Bite", "Filbert's Feast", "Pine Nut Place",
      "Sunflower Seed", "Pumpkin Patch", "Squash Court", "Zucchini Zone", "Cucumber Corner",
      "Tomato Town", "Pepper Palace", "Onion Oasis", "Garlic Garden", "Ginger Grove",
      "Turmeric Town", "Cinnamon Street", "Nutmeg Nook", "Clove Corner", "Cardamom Cafe",
      "Saffron Street", "Vanilla Valley", "Chocolate Chip", "Caramel Corner", "Honey House"
    ];

    const cuisines = [
      "Italian", "Japanese", "Chinese", "Mexican", "Indian", "Thai", "Vietnamese", "Korean",
      "French", "Spanish", "Greek", "Mediterranean", "American", "British", "German", "Russian",
      "Turkish", "Lebanese", "Moroccan", "Ethiopian", "Egyptian", "South African", "Brazilian",
      "Argentine", "Peruvian", "Colombian", "Venezuelan", "Caribbean", "Cuban", "Puerto Rican",
      "Jamaican", "Haitian", "Dominican", "Trinidadian", "Barbadian", "Grenadian", "St. Lucian",
      "Australian", "New Zealand", "Fijian", "Tongan", "Samoan", "Hawaiian", "Filipino",
      "Indonesian", "Malaysian", "Singaporean", "Cambodian", "Laotian", "Myanmar", "Nepalese",
      "Sri Lankan", "Bangladeshi", "Pakistani", "Afghan", "Iranian", "Iraqi", "Syrian",
      "Jordanian", "Israeli", "Palestinian", "Yemeni", "Omani", "Emirati", "Qatari",
      "Kuwaiti", "Bahraini", "Saudi", "Iraqi", "Kurdish", "Armenian", "Georgian",
      "Azerbaijani", "Kazakh", "Uzbek", "Turkmen", "Kyrgyz", "Tajik", "Mongolian",
      "Tibetan", "Bhutanese", "Maldives", "Seychelles", "Mauritian", "Madagascan",
      "Comorian", "Mayotte", "Reunion", "French Polynesian", "New Caledonian", "Vanuatuan"
    ];

    const streets = [
      "Main Street", "Oak Avenue", "Pine Street", "Elm Street", "Maple Drive", "Cedar Lane",
      "Birch Road", "Willow Way", "Spruce Street", "Ash Avenue", "Poplar Place", "Sycamore Street",
      "Magnolia Drive", "Juniper Lane", "Cypress Road", "Redwood Way", "Sequoia Street", "Palm Tree Lane",
      "Bamboo Road", "Cherry Blossom Way", "Lotus Street", "Golden Lane", "Silver Road", "Jade Street",
      "Ruby Lane", "Emerald Road", "Sapphire Street", "Diamond Way", "Platinum Road", "Copper Street",
      "Iron Lane", "Steel Road", "Brass Street", "Bronze Lane", "Crystal Road", "Pearl Street",
      "Coral Lane", "Amber Road", "Onyx Street", "Ivory Lane", "Ebony Road", "Mahogany Street",
      "Teak Lane", "Walnut Road", "Chestnut Street", "Hazelnut Lane", "Almond Road", "Pecan Street",
      "Cashew Lane", "Pistachio Road", "Macadamia Street", "Brazilian Lane", "Filbert Road", "Pine Nut Street"
    ];

    const neighborhoods = [
      "Downtown", "Uptown", "Midtown", "Westside", "Eastside", "Northside", "Southside",
      "Chinatown", "Little Italy", "Koreatown", "Japantown", "Little Mexico", "Little India",
      "Greek Town", "Little Havana", "Little Saigon", "Little Tokyo", "Little Manila",
      "Little Beirut", "Little Ethiopia", "Little Armenia", "Little Russia", "Little Ukraine",
      "Little Poland", "Little Germany", "Little France", "Little Spain", "Little Portugal",
      "Little Brazil", "Little Argentina", "Little Colombia", "Little Venezuela", "Little Peru",
      "Little Chile", "Little Uruguay", "Little Paraguay", "Little Bolivia", "Little Ecuador",
      "Little Guyana", "Little Suriname", "Little French Guiana", "Little Belize", "Little Guatemala",
      "Little Honduras", "Little Nicaragua", "Little Costa Rica", "Little Panama", "Little El Salvador"
    ];

    const features = [
      "Delivery", "Takeout", "Dine-in", "Outdoor Seating", "Reservations", "Private Dining",
      "Wine Pairing", "Buffet", "Quick Service", "Drive-thru", "Catering", "Live Music",
      "Karaoke", "Sports Bar", "Rooftop Dining", "Waterfront", "Garden Seating", "Fireplace",
      "Wine Cellar", "Craft Beer", "Cocktail Bar", "Coffee Bar", "Dessert Menu", "Gluten-Free Options",
      "Vegetarian Options", "Vegan Options", "Halal", "Kosher", "Organic", "Farm-to-Table",
      "Local Ingredients", "Seasonal Menu", "Chef's Table", "Tasting Menu", "Happy Hour",
      "Brunch", "Breakfast", "Lunch", "Dinner", "Late Night", "24 Hours", "Pet Friendly",
      "Wheelchair Accessible", "Parking Available", "Valet Parking", "Street Parking",
      "Bike Parking", "Public Transit", "Free WiFi", "Business Lunch", "Date Night",
      "Family Friendly", "Romantic", "Casual", "Upscale", "Fine Dining", "Fast Casual"
    ];

    const priceRanges = ["Budget", "Moderate", "Expensive", "Luxury"];
    const phonePrefixes = ["(555)", "(444)", "(333)", "(222)", "(111)", "(999)", "(888)", "(777)", "(666)"];

    const restaurants: Restaurant[] = [];

    for (let i = 0; i < 100; i++) {
      const name = restaurantNames[i % restaurantNames.length];
      const cuisine = cuisines[i % cuisines.length];
      const street = streets[i % streets.length];
      const neighborhood = neighborhoods[i % neighborhoods.length];
             const priceRange = priceRanges[i % priceRanges.length] as "Budget" | "Moderate" | "Expensive" | "Luxury";
      const phonePrefix = phonePrefixes[i % phonePrefixes.length];
      
      const phone = `${phonePrefix} ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
      const averageRating = Math.round((Math.random() * 2 + 3) * 10) / 10;
      const totalReviews = Math.floor(Math.random() * 500) + 10;
      
      const numFeatures = Math.floor(Math.random() * 4) + 3;
      const selectedFeatures = [];
      const shuffledFeatures = [...features].sort(() => 0.5 - Math.random());
      for (let j = 0; j < numFeatures; j++) {
        selectedFeatures.push(shuffledFeatures[j]);
      }

      const hours = {
        "Monday": this.generateHours(),
        "Tuesday": this.generateHours(),
        "Wednesday": this.generateHours(),
        "Thursday": this.generateHours(),
        "Friday": this.generateHours(),
        "Saturday": this.generateHours(),
        "Sunday": this.generateHours()
      };

      const imageId = Math.floor(Math.random() * 1000) + 1;
      const images = [`https://images.unsplash.com/photo-${imageId}?w=500`];

      restaurants.push({
        name,
        address: `${Math.floor(Math.random() * 9999) + 1} ${street}, ${neighborhood}`,
        cuisine,
        phone,
        website: `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
        averageRating,
        totalReviews,
        priceRange,
        hours,
        features: selectedFeatures,
        images,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return restaurants;
  }

  private generateHours(): string {
    const openHour = Math.floor(Math.random() * 4) + 7;
    const closeHour = Math.floor(Math.random() * 4) + 20;
    const openMinute = Math.random() > 0.5 ? "00" : "30";
    const closeMinute = Math.random() > 0.5 ? "00" : "30";
    
    if (Math.random() > 0.9) {
      return "Closed";
    }
    
    return `${openHour}:${openMinute} AM - ${closeHour}:${closeMinute} PM`;
  }
} 