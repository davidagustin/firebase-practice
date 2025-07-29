# Firebase Seed Data Scripts

This directory contains scripts to populate your Firebase Firestore database with sample restaurant data.

## Prerequisites

1. **Firebase Project Setup**: Make sure you have a Firebase project created
2. **Firestore Database**: Enable Firestore in your Firebase project
3. **Firebase Configuration**: Update the configuration in `seed-data.js`

## Setup Instructions

### 1. Update Firebase Configuration

Edit `seed-data.js` and replace the `firebaseConfig` object with your actual Firebase configuration:

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

You can find your Firebase configuration in:
- Firebase Console → Project Settings → General → Your Apps → SDK setup and configuration

### 2. Install Dependencies

```bash
cd scripts
npm install
```

### 3. Run the Seed Script

```bash
npm run seed
```

Or directly:

```bash
node seed-data.js
```

## Sample Data Included

The script will add the following sample data:

### Restaurants (10 total)
- **Pizza Palace** - Italian, Moderate pricing
- **Sushi Express** - Japanese, Expensive pricing  
- **Burger Barn** - American, Budget pricing
- **Taco Fiesta** - Mexican, Budget pricing
- **Golden Dragon** - Chinese, Moderate pricing
- **Le Bistro** - French, Luxury pricing
- **Spice Garden** - Indian, Moderate pricing
- **Pasta House** - Italian, Moderate pricing
- **Steak House** - American, Expensive pricing
- **Pho Palace** - Vietnamese, Budget pricing

### Reviews (3 per restaurant = 30 total)
Each restaurant will have 3 sample reviews with:
- Different ratings (4-5 stars)
- Realistic comments
- Sample user names
- Helpful vote counts

## Data Structure

### Restaurant Fields
- `name` - Restaurant name
- `address` - Full address
- `cuisine` - Type of cuisine
- `phone` - Contact number
- `website` - Website URL
- `averageRating` - Average star rating
- `totalReviews` - Number of reviews
- `priceRange` - Budget/Moderate/Expensive/Luxury
- `hours` - Operating hours for each day
- `features` - Array of features (Delivery, Takeout, etc.)
- `images` - Array of image URLs
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Review Fields
- `restaurantId` - Reference to restaurant
- `userId` - User ID
- `userName` - Display name
- `rating` - Star rating (1-5)
- `comment` - Review text
- `date` - Review date
- `helpful` - Number of helpful votes
- `images` - Array of review images

## Security Rules

Make sure your Firestore security rules allow write access for seeding:

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
  }
}
```

## Troubleshooting

### Common Issues

1. **Authentication Error**: Make sure your Firebase config is correct
2. **Permission Denied**: Check your Firestore security rules
3. **Network Error**: Ensure you have internet connection
4. **Duplicate Data**: The script will add new documents each time it runs

### Reset Data

To clear all data and start fresh:
1. Go to Firebase Console → Firestore Database
2. Select all documents and delete them
3. Run the seed script again

## Customization

You can modify the `restaurants` and `reviews` arrays in `seed-data.js` to:
- Add more restaurants
- Change restaurant details
- Modify review content
- Add different cuisines or features

## Next Steps

After running the seed script:
1. Start your Angular application: `npm start`
2. Navigate to the restaurants page
3. You should see all the sample restaurants with their reviews
4. Test the search, filter, and rating functionality 