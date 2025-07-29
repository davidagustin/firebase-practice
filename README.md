# 🍽️ FoodRater - Restaurant Rating App

A modern, responsive restaurant rating application built with Angular 17 and Firebase, inspired by Yelp. Users can discover restaurants, read reviews, and share their dining experiences with a beautiful, intuitive interface.

🌐 **Live Demo**: [https://fir-practice-54eb3.web.app/](https://fir-practice-54eb3.web.app/)

![FoodRater App](https://img.shields.io/badge/Angular-17-red?style=for-the-badge&logo=angular)
![Firebase](https://img.shields.io/badge/Firebase-Cloud-orange?style=for-the-badge&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Security](https://img.shields.io/badge/Security-Audited-green?style=for-the-badge&logo=shield)

## ✨ Features

### 🍽️ **Restaurant Discovery**
- Browse and search restaurants by cuisine, location, and price range
- Advanced filtering and sorting options
- Real-time search with debounced input
- Responsive grid layout for all devices

### ⭐ **Rating System**
- 5-star rating system with half-star support
- Detailed review system with comments
- Helpful vote system for reviews
- Average rating calculations and statistics

### 🔐 **User Authentication**
- Secure login/signup with Firebase Authentication
- User profile management
- Protected routes and data access
- Session management and security

### 📱 **Modern UI/UX**
- Responsive design for desktop, tablet, and mobile
- Beautiful gradient design with smooth animations
- Intuitive navigation and user experience
- Loading states and error handling

### 🔥 **Firebase Integration**
- Real-time data with Firestore
- Secure authentication and authorization
- Scalable cloud hosting
- Automatic data synchronization

## 🛠️ Tech Stack

- **Frontend**: Angular 17 (Standalone Components)
- **Backend**: Firebase (Firestore, Authentication, Hosting)
- **Styling**: SCSS with modern CSS Grid and Flexbox
- **State Management**: RxJS Observables
- **Security**: Comprehensive security measures and validation
- **Deployment**: Firebase Hosting (Static Site)

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Angular CLI

### 1. Clone and Install
```bash
git clone <repository-url>
cd firebase-practice
npm install
```

### 2. Set up Firebase (Interactive)
```bash
npm run setup:firebase
```
This interactive script will guide you through Firebase configuration.

### 3. Add Sample Data
```bash
npm run seed:data
```
This adds 10 restaurants with 30 reviews to your database.

### 4. Start Development
```bash
npm start
```
Visit `http://localhost:4200` to see your app!

## 🔧 Available Commands

```bash
# Development
npm start                    # Start development server
npm run build               # Build for production
npm test                    # Run tests

# Firebase Setup
npm run setup:firebase      # Interactive Firebase setup
npm run seed:data          # Add sample restaurant data
npm run get:config         # Get current Firebase config

# Security
npm run security:audit     # Run security audit
npm run security:cleanup   # Clean up code and remove console logs
npm run security:deploy-rules # Deploy Firestore security rules

# Deployment
npm run deploy             # Build and deploy to Firebase
```

## 📁 Project Structure

```
src/
├── app/
│   ├── models/           # Data models and interfaces
│   ├── pages/           # Page components
│   │   ├── home/        # Home page with search
│   │   ├── restaurants/ # Restaurant listing with filters
│   │   ├── auth/        # Authentication pages
│   │   ├── add-restaurant/ # Add restaurant form
│   │   └── restaurant-detail/ # Restaurant detail page
│   ├── services/        # Firebase services
│   ├── shared/          # Shared components
│   │   └── rating/      # Rating component
│   └── environments/    # Environment configurations
├── assets/              # Static assets
└── styles/              # Global styles

scripts/                 # Utility scripts
├── seed-data.js        # Database seeding
├── security-audit.js   # Security audit
├── code-cleanup.js     # Code cleanup
└── setup-firebase.js   # Firebase setup
```

## 🔒 Security Features

### Authentication & Authorization
- **Firebase Authentication**: Secure email/password authentication
- **User-Specific Access**: Users can only modify their own data
- **Role-Based Permissions**: Different access levels for authenticated vs anonymous users
- **Session Management**: Automatic session handling with Firebase Auth

### Data Protection
- **Secure Firestore Rules**: Comprehensive validation and access control
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Angular's built-in sanitization
- **CSRF Protection**: Firebase's built-in protection

### Web Security Headers
- **Content Security Policy**: Restricts script execution
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Enables XSS filtering
- **Referrer-Policy**: Controls referrer information

### Security Tools
- **Automated Security Audit**: `npm run security:audit`
- **Code Cleanup**: `npm run security:cleanup`
- **Firestore Rules**: Secure database access control

## 🌱 Sample Data

The app includes 10 sample restaurants with realistic data:

### Restaurants
- 🍕 **Pizza Palace** - Italian, Moderate pricing
- 🍣 **Sushi Express** - Japanese, Expensive pricing  
- 🍔 **Burger Barn** - American, Budget pricing
- 🌮 **Taco Fiesta** - Mexican, Budget pricing
- 🥢 **Golden Dragon** - Chinese, Moderate pricing
- 🍷 **Le Bistro** - French, Luxury pricing
- 🌶️ **Spice Garden** - Indian, Moderate pricing
- 🍝 **Pasta House** - Italian, Moderate pricing
- 🥩 **Steak House** - American, Expensive pricing
- 🍜 **Pho Palace** - Vietnamese, Budget pricing

### Features Included
- Realistic restaurant information
- Operating hours for each day
- Price ranges (Budget/Moderate/Expensive/Luxury)
- Restaurant features (Delivery, Takeout, etc.)
- High-quality food images from Unsplash
- Sample reviews with ratings and comments

## 🔧 Firebase Configuration

### Environment Files
Update these files with your Firebase configuration:

**`src/environments/environment.ts`**
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

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Restaurant rules
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Review rules
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && 
        request.auth.uid == resource.data.userId;
    }
    
    // User profile rules
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
  }
}
```

## 🚀 Deployment

### 1. Build for Production
```bash
npm run build
```

### 2. Deploy to Firebase Hosting
```bash
firebase deploy
```

### 3. Deploy Security Rules
```bash
npm run security:deploy-rules
```

## 🧪 Testing

### Security Testing
```bash
# Run security audit
npm run security:audit

# Test search functionality
cd scripts && node quick-search-test.js
```

### Manual Testing Checklist
- [ ] Authentication (login/signup)
- [ ] Restaurant browsing and search
- [ ] Review system
- [ ] Responsive design
- [ ] Security features

## 🔍 Troubleshooting

### Common Issues

**"Permission denied" error**
- Check Firestore security rules
- Verify Firebase configuration
- Ensure Firestore is enabled

**"Firebase not initialized" error**
- Verify environment files are updated
- Check Firebase configuration
- Restart development server

**No data showing**
- Run seed script: `npm run seed:data`
- Check browser console for errors
- Verify Firestore collections exist

**Authentication not working**
- Enable Email/Password in Firebase Console
- Check authentication configuration
- Verify Firebase project settings

### Getting Help
1. Check browser console for error messages
2. Verify Firebase configuration
3. Review security rules
4. Check the troubleshooting guides

## 📊 Performance

- **Optimized Bundle Size**: Efficient code splitting
- **Lazy Loading**: Components loaded on demand
- **Efficient Data Fetching**: RxJS observables for real-time updates
- **Static Site Generation**: Fast loading with Firebase Hosting
- **CDN Distribution**: Global content delivery

## 🎨 Design Features

- **Color Scheme**: Modern gradient design with orange/red theme
- **Typography**: Clean, readable fonts
- **Layout**: Card-based design with proper spacing
- **Animations**: Smooth hover effects and transitions
- **Icons**: Emoji-based icons for better visual appeal
- **Responsive**: Mobile-first design approach

## 🔄 Maintenance

### Regular Updates
- **Monthly**: Security audit and dependency updates
- **Quarterly**: Security rule review and updates
- **Annually**: Comprehensive security assessment

### Security Monitoring
- Automated security audits
- Dependency vulnerability scanning
- Firebase Analytics for error tracking
- Firestore access logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the maintainers
4. Review the troubleshooting guides

## 🙏 Acknowledgments

- Inspired by Yelp's restaurant rating system
- Built with modern web technologies
- Designed for optimal user experience
- Comprehensive security implementation

---

**Built with ❤️ using Angular 17 and Firebase**

**Last Updated**: December 2024  
**Version**: 1.0  
**Maintainer**: Development Team
