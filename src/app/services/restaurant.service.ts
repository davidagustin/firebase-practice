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
        return of([]); // Return empty array on error
      })
    );
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
        return of([]); // Return empty array on error
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