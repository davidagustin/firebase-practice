import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { getAuth, provideAuth, connectAuthEmulator } from '@angular/fire/auth';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideFirebaseApp(() => {
      try {
        const app = initializeApp(environment.firebase);
        console.log('Firebase initialized successfully');
        return app;
      } catch (error) {
        console.error('Firebase initialization error:', error);
        // Return a mock app to prevent the app from crashing
        return { name: 'mock-app' } as any;
      }
    }),
    provideFirestore(() => {
      try {
        const firestore = getFirestore();
        console.log('Firestore initialized successfully');
        return firestore;
      } catch (error) {
        console.error('Firestore initialization error:', error);
        // Return a mock firestore to prevent the app from crashing
        return { collection: () => ({}) } as any;
      }
    }),
    provideAuth(() => {
      try {
        const auth = getAuth();
        console.log('Auth initialized successfully');
        return auth;
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Return a mock auth to prevent the app from crashing
        return { signInWithEmailAndPassword: () => Promise.resolve({ user: null }) } as any;
      }
    })
  ]
};
