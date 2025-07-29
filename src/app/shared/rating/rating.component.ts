import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="flex items-center gap-2">
      <div class="flex items-center">
        <mat-icon 
          *ngFor="let star of stars; let i = index" 
          class="cursor-pointer transition-colors duration-200"
          [class.text-yellow-500]="i < (hoverRating || rating)"
          [class.text-gray-300]="i >= (hoverRating || rating)"
          [class.text-yellow-400]="i === Math.floor(rating) && rating % 1 !== 0 && !hoverRating"
          [class.text-yellow-300]="i === Math.floor(rating) && rating % 1 !== 0 && !hoverRating"
          (click)="onStarClick(i + 1)"
          (mouseenter)="hoverRating = i + 1"
          (mouseleave)="hoverRating = 0"
          [matTooltip]="readonly ? '' : 'Rate ' + (i + 1) + ' stars'"
          [class.cursor-default]="readonly"
          [class.cursor-pointer]="!readonly">
          {{ getStarIcon(i) }}
        </mat-icon>
      </div>
      <span class="text-sm text-gray-600 font-medium" *ngIf="showText">
        {{ rating.toFixed(1) }}/5
      </span>
    </div>
  `,
  styles: []
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

  getStarIcon(index: number): string {
    if (this.hoverRating > 0) {
      return index < this.hoverRating ? 'star' : 'star_border';
    }
    
    if (index < Math.floor(this.rating)) {
      return 'star';
    } else if (index === Math.floor(this.rating) && this.rating % 1 !== 0) {
      return 'star_half';
    } else {
      return 'star_border';
    }
  }
} 