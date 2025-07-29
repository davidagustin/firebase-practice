export interface Restaurant {
  id?: string;
  name: string;
  address: string;
  cuisine: string;
  phone: string;
  website?: string;
  averageRating: number;
  totalReviews: number;
  priceRange: 'Budget' | 'Moderate' | 'Expensive' | 'Luxury';
  hours: {
    [key: string]: string;
  };
  features: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id?: string;
  restaurantId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
  images?: string[];
}

export interface User {
  id?: string;
  email: string;
  displayName: string;
  photoURL?: string;
  reviewsCount: number;
  memberSince: Date;
} 