import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rating-container">
      <div class="stars">
        <span 
          *ngFor="let star of stars; let i = index" 
          class="star"
          [class.filled]="i < rating"
          [class.half]="i === Math.floor(rating) && rating % 1 !== 0"
          (click)="onStarClick(i + 1)"
          (mouseenter)="hoverRating = i + 1"
          (mouseleave)="hoverRating = 0">
          ★
        </span>
      </div>
      <span class="rating-text" *ngIf="showText">{{ rating }}/5</span>
    </div>
  `,
  styles: [`
    .rating-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stars {
      display: flex;
      gap: 2px;
    }

    .star {
      font-size: 20px;
      cursor: pointer;
      color: #ddd;
      transition: color 0.2s ease;
    }

    .star.filled {
      color: #ffd700;
    }

    .star.half {
      color: #ffd700;
      position: relative;
    }

    .star.half::after {
      content: '★';
      position: absolute;
      left: 0;
      top: 0;
      color: #ddd;
      clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
    }

    .star:hover {
      color: #ffd700;
    }

    .rating-text {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
  `]
})
export class RatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Input() showText: boolean = true;
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  hoverRating: number = 0;
  Math = Math;

  onStarClick(starRating: number) {
    if (!this.readonly) {
      this.rating = starRating;
      this.ratingChange.emit(starRating);
    }
  }
} 