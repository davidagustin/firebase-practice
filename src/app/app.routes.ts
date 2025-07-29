import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { AddRestaurantComponent } from './pages/add-restaurant/add-restaurant.component';
import { RestaurantDetailComponent } from './pages/restaurant-detail/restaurant-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'restaurants', component: RestaurantsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'add-restaurant', component: AddRestaurantComponent },

  { path: 'restaurant/:id', component: RestaurantDetailComponent },
  { path: 'profile', component: HomeComponent }, // TODO: Create ProfileComponent
  { path: 'favorites', component: HomeComponent }, // TODO: Create FavoritesComponent
  { path: '**', redirectTo: '' }
];
