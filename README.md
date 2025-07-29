# FoodRater - Restaurant Rating App

A modern, responsive restaurant rating application built with Angular and Firebase, inspired by Yelp. Users can discover restaurants, read reviews, and share their dining experiences.

## Features

- 🍽️ **Restaurant Discovery**: Browse and search restaurants by cuisine, location, and price range
- ⭐ **Rating System**: Rate restaurants with a 5-star system and leave detailed reviews
- 🔐 **User Authentication**: Secure login/signup with Firebase Authentication
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🔥 **Firebase Integration**: Real-time data with Firestore and secure authentication
- 🎨 **Modern UI**: Beautiful, intuitive interface with smooth animations

## Tech Stack

- **Frontend**: Angular 17 (Standalone Components)
- **Backend**: Firebase (Firestore, Authentication, Hosting)
- **Styling**: SCSS with modern CSS Grid and Flexbox
- **State Management**: RxJS Observables
- **Deployment**: Firebase Hosting (Static Site)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Angular CLI

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yelp-rating-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Get your Firebase configuration

4. **Configure Firebase**
   - Update `src/environments/environment.ts` with your Firebase config:
   ```typescript
   export const environment = {
     production: false,
     firebase: {
       apiKey: "your-api-key",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789",
       appId: "your-app-id"
     }
   };
   ```
   - Update `src/environments/environment.prod.ts` with the same config
   - Update `.firebaserc` with your project ID

5. **Set up Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read access to all users
       match /restaurants/{restaurantId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       
       // Allow authenticated users to read/write reviews
       match /reviews/{reviewId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       
       // Allow users to read/write their own user data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

## Development

1. **Start the development server**
   ```bash
   npm start
   ```

2. **Open your browser**
   Navigate to `http://localhost:4200`

3. **Build for production**
   ```bash
   npm run build
   ```

## Deployment

1. **Install Firebase CLI** (if not already installed)
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Build the application**
   ```bash
   npm run build
   ```

4. **Deploy to Firebase Hosting**
   ```bash
   firebase deploy
   ```

## Project Structure

```
src/
├── app/
│   ├── models/           # Data models and interfaces
│   ├── pages/           # Page components
│   │   ├── home/        # Home page
│   │   ├── restaurants/ # Restaurant listing
│   │   ├── auth/        # Authentication pages
│   │   └── add-restaurant/ # Add restaurant form
│   ├── services/        # Firebase services
│   ├── shared/          # Shared components
│   │   └── rating/      # Rating component
│   └── environments/    # Environment configurations
├── assets/              # Static assets
└── styles/              # Global styles
```

## Features in Detail

### Restaurant Management
- Add new restaurants with detailed information
- Browse restaurants with advanced filtering
- Search by name, cuisine, or location
- Sort by rating, name, or number of reviews

### Rating System
- 5-star rating system with half-star support
- Detailed review system with comments
- Helpful vote system for reviews
- Average rating calculations

### User Experience
- Responsive design for all devices
- Smooth animations and transitions
- Intuitive navigation
- Loading states and error handling

### Authentication
- Email/password authentication
- User profile management
- Secure routes and data access
- Session management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the maintainers

## Acknowledgments

- Inspired by Yelp's restaurant rating system
- Built with modern web technologies
- Designed for optimal user experience
