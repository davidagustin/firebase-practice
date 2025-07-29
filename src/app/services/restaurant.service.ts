import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';
import { Observable, from, map, timeout, catchError, of } from 'rxjs';
import { Restaurant, Review } from '../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  constructor(private firestore: Firestore) {}

  // Get all restaurants
  getRestaurants(): Observable<Restaurant[]> {
    const restaurantsRef = collection(this.firestore, 'restaurants');
    return from(getDocs(restaurantsRef)).pipe(
      timeout(10000), // 10 second timeout
      map(snapshot => snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Restaurant))),
      catchError(error => {
        console.error('Error fetching restaurants:', error);
        // Return sample data if Firebase fails
        return of(this.getSampleRestaurants());
      })
    );
  }

  // Sample restaurants for demo purposes
  private getSampleRestaurants(): Restaurant[] {
    return [
      {
        id: '1',
        name: 'Pizza Palace',
        cuisine: 'Italian',
        address: '123 Main St, Downtown',
        phone: '+1-555-0123',
        priceRange: 'Moderate',
        averageRating: 4.5,
        totalReviews: 128,
        images: ['assets/default-restaurant.jpg'],
        features: ['Delivery', 'Takeout', 'Dine-in'],
        hours: {
          monday: '11:00 AM - 10:00 PM',
          tuesday: '11:00 AM - 10:00 PM',
          wednesday: '11:00 AM - 10:00 PM',
          thursday: '11:00 AM - 10:00 PM',
          friday: '11:00 AM - 11:00 PM',
          saturday: '12:00 PM - 11:00 PM',
          sunday: '12:00 PM - 9:00 PM'
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Sushi Express',
        cuisine: 'Japanese',
        address: '456 Oak Ave, Midtown',
        phone: '+1-555-0456',
        priceRange: 'Expensive',
        averageRating: 4.8,
        totalReviews: 95,
        images: ['assets/default-restaurant.jpg'],
        features: ['Dine-in', 'Takeout'],
        hours: {
          monday: 'Closed',
          tuesday: '5:00 PM - 10:00 PM',
          wednesday: '5:00 PM - 10:00 PM',
          thursday: '5:00 PM - 10:00 PM',
          friday: '5:00 PM - 11:00 PM',
          saturday: '5:00 PM - 11:00 PM',
          sunday: '5:00 PM - 9:00 PM'
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '3',
        name: 'Burger Joint',
        cuisine: 'American',
        address: '789 Pine St, Uptown',
        phone: '+1-555-0789',
        priceRange: 'Budget',
        averageRating: 4.2,
        totalReviews: 203,
        images: ['assets/default-restaurant.jpg'],
        features: ['Delivery', 'Takeout', 'Dine-in'],
        hours: {
          monday: '10:00 AM - 11:00 PM',
          tuesday: '10:00 AM - 11:00 PM',
          wednesday: '10:00 AM - 11:00 PM',
          thursday: '10:00 AM - 11:00 PM',
          friday: '10:00 AM - 12:00 AM',
          saturday: '10:00 AM - 12:00 AM',
          sunday: '11:00 AM - 10:00 PM'
        },
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '4',
        name: 'Taco Fiesta',
        cuisine: 'Mexican',
        address: '321 Elm St, Downtown',
        phone: '+1-555-0321',
        priceRange: 'Budget',
        averageRating: 4.3,
        totalReviews: 156,
        images: ['assets/default-restaurant.jpg'],
        features: ['Delivery', 'Takeout', 'Dine-in'],
        hours: {
          monday: '11:00 AM - 10:00 PM',
          tuesday: '11:00 AM - 10:00 PM',
          wednesday: '11:00 AM - 10:00 PM',
          thursday: '11:00 AM - 10:00 PM',
          friday: '11:00 AM - 11:00 PM',
          saturday: '11:00 AM - 11:00 PM',
          sunday: '12:00 PM - 9:00 PM'
        },
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '5',
        name: 'French Bistro',
        cuisine: 'French',
        address: '654 Maple Dr, Midtown',
        phone: '+1-555-0654',
        priceRange: 'Luxury',
        averageRating: 4.7,
        totalReviews: 87,
        images: ['assets/default-restaurant.jpg'],
        features: ['Dine-in'],
        hours: {
          monday: 'Closed',
          tuesday: '6:00 PM - 10:00 PM',
          wednesday: '6:00 PM - 10:00 PM',
          thursday: '6:00 PM - 10:00 PM',
          friday: '6:00 PM - 11:00 PM',
          saturday: '6:00 PM - 11:00 PM',
          sunday: '5:00 PM - 9:00 PM'
        },
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05')
      },
      {
        id: '6',
        name: 'Thai Spice',
        cuisine: 'Thai',
        address: '987 Cedar Ln, Uptown',
        phone: '+1-555-0987',
        priceRange: 'Moderate',
        averageRating: 4.4,
        totalReviews: 134,
        images: ['assets/default-restaurant.jpg'],
        features: ['Delivery', 'Takeout', 'Dine-in'],
        hours: {
          monday: '11:00 AM - 10:00 PM',
          tuesday: '11:00 AM - 10:00 PM',
          wednesday: '11:00 AM - 10:00 PM',
          thursday: '11:00 AM - 10:00 PM',
          friday: '11:00 AM - 11:00 PM',
          saturday: '11:00 AM - 11:00 PM',
          sunday: '12:00 PM - 9:00 PM'
        },
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25')
      }
    ];
  }

  // Get restaurant by ID
  getRestaurant(id: string): Observable<Restaurant | null> {
    const restaurantRef = doc(this.firestore, 'restaurants', id);
    return from(getDoc(restaurantRef)).pipe(
      map(doc => doc.exists() ? { id: doc.id, ...doc.data() } as Restaurant : null)
    );
  }

  // Add new restaurant
  addRestaurant(restaurant: Omit<Restaurant, 'id'>): Observable<string> {
    const restaurantsRef = collection(this.firestore, 'restaurants');
    return from(addDoc(restaurantsRef, {
      ...restaurant,
      createdAt: new Date(),
      updatedAt: new Date()
    })).pipe(
      map(docRef => docRef.id)
    );
  }

  // Update restaurant
  updateRestaurant(id: string, updates: Partial<Restaurant>): Observable<void> {
    const restaurantRef = doc(this.firestore, 'restaurants', id);
    return from(updateDoc(restaurantRef, {
      ...updates,
      updatedAt: new Date()
    }));
  }

  // Delete restaurant
  deleteRestaurant(id: string): Observable<void> {
    const restaurantRef = doc(this.firestore, 'restaurants', id);
    return from(deleteDoc(restaurantRef));
  }

  // Search restaurants
  searchRestaurants(searchTerm: string): Observable<Restaurant[]> {
    const restaurantsRef = collection(this.firestore, 'restaurants');
    const q = query(
      restaurantsRef,
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Restaurant)))
    );
  }

  // Get top rated restaurants
  getTopRatedRestaurants(limitCount: number = 10): Observable<Restaurant[]> {
    const restaurantsRef = collection(this.firestore, 'restaurants');
    const q = query(
      restaurantsRef,
      orderBy('averageRating', 'desc'),
      limit(limitCount)
    );
    return from(getDocs(q)).pipe(
      timeout(10000), // 10 second timeout
      map(snapshot => snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Restaurant))),
      catchError(error => {
        console.error('Error fetching top rated restaurants:', error);
        // Return sample data if Firebase fails
        return of(this.getSampleRestaurants().slice(0, limitCount));
      })
    );
  }

  // Get reviews for a restaurant
  getRestaurantReviews(restaurantId: string): Observable<Review[]> {
    const reviewsRef = collection(this.firestore, 'reviews');
    const q = query(
      reviewsRef,
      where('restaurantId', '==', restaurantId),
      orderBy('date', 'desc')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review)))
    );
  }

  // Add review
  addReview(review: Omit<Review, 'id'>): Observable<string> {
    const reviewsRef = collection(this.firestore, 'reviews');
    return from(addDoc(reviewsRef, {
      ...review,
      date: new Date(),
      helpful: 0
    })).pipe(
      map(docRef => docRef.id)
    );
  }
} 