import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {}

  // Sign in with email and password
  signIn(email: string, password: string): Observable<User | null> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(result => result.user)
    );
  }

  // Sign up with email and password
  signUp(email: string, password: string): Observable<User | null> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map(result => result.user)
    );
  }

  // Sign out
  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  // Get current user
  getCurrentUser(): Observable<User | null> {
    return new Observable(observer => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
      return unsubscribe;
    });
  }

  // Check if user is authenticated
  isAuthenticated(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => !!user)
    );
  }
} 