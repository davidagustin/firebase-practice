import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('FoodRater');
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.currentUser$ = this.authService.getCurrentUser();
  }
  signOut() {
    this.authService.signOut().subscribe();
  }
}
