# 🔥 Firebase Setup & Restaurant Data Guide

This guide will help you set up Firebase and add sample restaurant data to your Yelp-like rating app.

## 📋 Prerequisites

1. **Firebase Account**: You need a Google account
2. **Firebase Project**: A Firebase project (can be created during setup)
3. **Firestore Database**: Enabled in your Firebase project

## 🚀 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter a project name (e.g., "foodrater-app")
4. Choose whether to enable Google Analytics (optional)
5. Click **"Create project"**

### 2. Enable Firestore Database

1. In your Firebase project, click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll update security rules later)
4. Select a location for your database (choose the closest to your users)
5. Click **"Done"**

### 3. Get Firebase Configuration

1. In Firebase Console, click the **gear icon** (⚙️) next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. If you don't have a web app, click **"Add app"** and choose the web icon (</>)
5. Register your app with a nickname (e.g., "foodrater-web")
6. Copy the `firebaseConfig` object

### 4. Update Environment Files

Update these files with your actual Firebase configuration:

**File: `src/environments/environment.ts`**
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
  }
};
```

**File: `src/environments/environment.prod.ts`**
```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
  }
};
```

### 5. Update Seed Script Configuration

**File: `scripts/seed-data.js`**
Replace the `firebaseConfig` object with your actual configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 6. Enable Authentication (Optional)

If you want to test user authentication:

1. In Firebase Console, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"** provider
5. Click **"Save"**

### 7. Set Up Security Rules

1. In Firestore Database, click **"Rules"** tab
2. Replace the rules with:

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

3. Click **"Publish"**

## 🌱 Adding Restaurant Data

### Option 1: Using the Seed Script (Recommended)

1. **Install dependencies**:
   ```bash
   cd scripts
   npm install
   ```

2. **Run the seed script**:
   ```bash
   npm run seed
   ```

3. **Verify data was added**:
   - Go to Firebase Console → Firestore Database
   - You should see `restaurants` and `reviews` collections
   - Each restaurant should have 3 sample reviews

### Option 2: Manual Addition via Firebase Console

1. Go to Firebase Console → Firestore Database
2. Click **"Start collection"**
3. Collection ID: `restaurants`
4. Add documents with the following fields:

**Sample Restaurant Document:**
```json
{
  "name": "Pizza Palace",
  "address": "123 Main Street, Downtown",
  "cuisine": "Italian",
  "phone": "(555) 123-4567",
  "website": "https://pizzapalace.com",
  "averageRating": 4.5,
  "totalReviews": 127,
  "priceRange": "Moderate",
  "hours": {
    "Monday": "11:00 AM - 10:00 PM",
    "Tuesday": "11:00 AM - 10:00 PM",
    "Wednesday": "11:00 AM - 10:00 PM",
    "Thursday": "11:00 AM - 10:00 PM",
    "Friday": "11:00 AM - 11:00 PM",
    "Saturday": "12:00 PM - 11:00 PM",
    "Sunday": "12:00 PM - 9:00 PM"
  },
  "features": ["Delivery", "Takeout", "Dine-in", "Outdoor Seating"],
  "images": ["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

## 🧪 Testing the Application

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Open your browser** and navigate to `http://localhost:4200`

3. **Test the features**:
   - Browse restaurants on the home page
   - Search and filter restaurants
   - View restaurant details
   - Add new restaurants (if authenticated)
   - Leave reviews (if authenticated)

## 📊 Sample Data Included

The seed script adds **10 restaurants** with **3 reviews each**:

### Restaurants
- 🍕 **Pizza Palace** - Italian, Moderate
- 🍣 **Sushi Express** - Japanese, Expensive
- 🍔 **Burger Barn** - American, Budget
- 🌮 **Taco Fiesta** - Mexican, Budget
- 🥢 **Golden Dragon** - Chinese, Moderate
- 🍷 **Le Bistro** - French, Luxury
- 🌶️ **Spice Garden** - Indian, Moderate
- 🍝 **Pasta House** - Italian, Moderate
- 🥩 **Steak House** - American, Expensive
- 🍜 **Pho Palace** - Vietnamese, Budget

### Features Included
- Realistic restaurant information
- Operating hours for each day
- Price ranges (Budget/Moderate/Expensive/Luxury)
- Restaurant features (Delivery, Takeout, etc.)
- High-quality food images from Unsplash
- Sample reviews with ratings and comments

## 🔧 Troubleshooting

### Common Issues

1. **"Permission denied" error**:
   - Check your Firestore security rules
   - Make sure you're using the correct Firebase config

2. **"Firebase not initialized" error**:
   - Verify your Firebase configuration is correct
   - Check that all environment files are updated

3. **No data showing in the app**:
   - Run the seed script to add sample data
   - Check the browser console for errors
   - Verify Firestore collections exist

4. **Authentication not working**:
   - Enable Email/Password authentication in Firebase Console
   - Check that auth is properly configured in your app

### Getting Help

1. Check the browser console for error messages
2. Verify your Firebase configuration matches the console
3. Ensure Firestore security rules allow read access
4. Check that collections exist in Firestore Database

## 🎯 Next Steps

After setting up Firebase and adding data:

1. **Customize the data**: Modify the seed script to add your own restaurants
2. **Deploy to Firebase Hosting**: Use `firebase deploy` to host your app
3. **Add more features**: Implement user profiles, favorites, etc.
4. **Enhance security**: Add more specific security rules as needed

## 📞 Support

If you encounter issues:
1. Check the Firebase documentation
2. Review the error messages in the console
3. Verify all configuration steps were completed
4. Test with the sample data first before adding your own 