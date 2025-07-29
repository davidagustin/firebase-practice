# 🍽️ Restaurant Data Setup - Quick Reference

## 🚀 Quick Start

### 1. Set up Firebase Configuration
```bash
npm run setup:firebase
```
This interactive script will help you configure Firebase with your project details.

### 2. Add Sample Restaurant Data
```bash
npm run seed:data
```
This will add 10 restaurants with 3 reviews each to your Firestore database.

### 3. Start the Application
```bash
npm start
```
Visit `http://localhost:4200` to see your restaurant data in action!

## 📊 What Data Gets Added

### Restaurants (10 total)
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

### Reviews (30 total)
- 3 reviews per restaurant
- Ratings from 4-5 stars
- Realistic comments and user names
- Helpful vote counts

## 🔧 Manual Setup (if needed)

### 1. Update Firebase Configuration
Edit these files with your Firebase config:
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`
- `scripts/seed-data.js`

### 2. Set Firestore Security Rules
In Firebase Console → Firestore Database → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Run Seed Script Manually
```bash
cd scripts
npm install
npm run seed
```

## 📁 Files Created

- `scripts/seed-data.js` - Main seeding script
- `scripts/setup-firebase.js` - Interactive Firebase setup
- `scripts/get-firebase-config.js` - Extract config from environment
- `scripts/package.json` - Dependencies for scripts
- `scripts/README.md` - Detailed documentation
- `SETUP_FIREBASE.md` - Comprehensive setup guide
- `RESTAURANT_DATA_SETUP.md` - This quick reference

## 🎯 Available Commands

```bash
# Interactive Firebase setup
npm run setup:firebase

# Add sample restaurant data
npm run seed:data

# Get current Firebase config
npm run get:config

# Start development server
npm start

# Deploy to Firebase hosting
npm run deploy
```

## 🔍 Troubleshooting

### No data showing?
1. Check browser console for errors
2. Verify Firebase configuration is correct
3. Ensure Firestore security rules allow read access
4. Run the seed script: `npm run seed:data`

### Permission errors?
1. Check Firestore security rules
2. Verify Firebase project ID is correct
3. Make sure Firestore is enabled in your project

### Configuration issues?
1. Run `npm run setup:firebase` for interactive setup
2. Check `npm run get:config` to see current configuration
3. Verify all environment files are updated

## 📞 Need Help?

1. Check the detailed guide: `SETUP_FIREBASE.md`
2. Review the scripts documentation: `scripts/README.md`
3. Check browser console for error messages
4. Verify Firebase Console for data and configuration

## 🎉 Success Indicators

✅ **Firebase configured correctly** - No console errors
✅ **Data seeded successfully** - 10 restaurants, 30 reviews in Firestore
✅ **App loads without errors** - Home page shows featured restaurants
✅ **Search works** - Can find restaurants by name/cuisine
✅ **Details page works** - Can view restaurant details and reviews

Your restaurant rating app is now ready with sample data! 🚀 