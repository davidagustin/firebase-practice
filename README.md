# 🍽️ FoodRater - Restaurant Rating App

A modern, responsive restaurant rating application built with Angular 17 and Firebase, inspired by Yelp. Users can discover restaurants, read reviews, and share their dining experiences with a beautiful, intuitive interface.

🌐 **Live Demo**: [https://firebase-practice--fir-practice-54eb3.us-central1.hosted.app/](https://firebase-practice--fir-practice-54eb3.us-central1.hosted.app/)

![Angular](https://img.shields.io/badge/Angular-17-red?style=for-the-badge&logo=angular)
![Firebase](https://img.shields.io/badge/Firebase-Cloud-orange?style=for-the-badge&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🍽️ **Restaurant Discovery**
- Browse and search restaurants by cuisine, location, and price range
- Advanced filtering and sorting options
- Real-time search with debounced input
- Responsive grid and list layouts

### ⭐ **Rating System**
- 5-star rating system with half-star support
- Detailed review system with comments
- Average rating calculations and statistics

### 🔐 **User Authentication**
- Secure login/signup with Firebase Authentication
- User profile management
- Protected routes and data access

### 📱 **Modern UI/UX**
- Responsive design for desktop, tablet, and mobile
- Beautiful gradient design with smooth animations
- Material Design components with Tailwind CSS
- Loading states and error handling

### 🔥 **Firebase Integration**
- Real-time data with Firestore
- Secure authentication and authorization
- Scalable cloud hosting
- Automatic data synchronization

## 🛠️ Tech Stack

- **Frontend**: Angular 17 (Standalone Components)
- **Backend**: Firebase (Firestore, Authentication, Hosting)
- **Styling**: Tailwind CSS + Angular Material
- **State Management**: RxJS Observables
- **Deployment**: Firebase Hosting

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### 1. Clone and Install
```bash
git clone <repository-url>
cd firebase-practice
npm install
```

### 2. Set up Firebase
```bash
npm run setup:firebase
```
This interactive script will guide you through Firebase configuration.

### 3. Add Sample Data
```bash
npm run seed:data
```
This adds sample restaurants with reviews to your database.

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
│   │   ├── bulk-add-restaurants/ # Bulk restaurant addition
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

### Data Protection
- **Secure Firestore Rules**: Comprehensive validation and access control
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Angular's built-in sanitization

### Security Tools
- **Automated Security Audit**: `npm run security:audit`
- **Code Cleanup**: `npm run security:cleanup`
- **Firestore Rules**: Secure database access control

## 🌱 Sample Data

The app includes sample restaurants with realistic data:

### Restaurants
- 🍕 **Pizza Palace** - Italian, Moderate pricing
- 🍣 **Sushi Express** - Japanese, Expensive pricing  
- 🍔 **Burger Joint** - American, Budget pricing
- 🌮 **Taco Fiesta** - Mexican, Budget pricing
- 🥢 **Golden Dragon** - Chinese, Moderate pricing
- 🍷 **French Bistro** - French, Luxury pricing
- 🌶️ **Spice Garden** - Indian, Moderate pricing
- 🍝 **Pasta House** - Italian, Moderate pricing
- 🥩 **Steak House** - American, Expensive pricing
- 🍜 **Pho Palace** - Vietnamese, Budget pricing

### Features Included
- Realistic restaurant information
- Operating hours for each day
- Price ranges (Budget/Moderate/Expensive/Luxury)
- Restaurant features (Delivery, Takeout, etc.)
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
- **Icons**: Material Design icons for better visual appeal
- **Responsive**: Mobile-first design approach

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

---

**Built with ❤️ using Angular 17 and Firebase**

**Last Updated**: December 2024  
**Version**: 1.0
