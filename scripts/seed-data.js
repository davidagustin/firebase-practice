const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc } = require('firebase/firestore');

// Firebase configuration - you'll need to update this with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyAPiFcadcuqy0I0Bps6xFZAwzg0r3sXSyI",
  authDomain: "fir-practice-54eb3.firebaseapp.com",
  projectId: "fir-practice-54eb3",
  storageBucket: "fir-practice-54eb3.firebasestorage.app",
  messagingSenderId: "872925798496",
  appId: "1:872925798496:web:8cd2dcf4ab6ab2e66ce305"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample restaurant data
const restaurants = [
  {
    name: "Pizza Palace",
    address: "123 Main Street, Downtown",
    cuisine: "Italian",
    phone: "(555) 123-4567",
    website: "https://pizzapalace.com",
    averageRating: 4.5,
    totalReviews: 127,
    priceRange: "Moderate",
    hours: {
      "Monday": "11:00 AM - 10:00 PM",
      "Tuesday": "11:00 AM - 10:00 PM",
      "Wednesday": "11:00 AM - 10:00 PM",
      "Thursday": "11:00 AM - 10:00 PM",
      "Friday": "11:00 AM - 11:00 PM",
      "Saturday": "12:00 PM - 11:00 PM",
      "Sunday": "12:00 PM - 9:00 PM"
    },
    features: ["Delivery", "Takeout", "Dine-in", "Outdoor Seating"],
    images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Sushi Express",
    address: "456 Oak Avenue, Midtown",
    cuisine: "Japanese",
    phone: "(555) 234-5678",
    website: "https://sushiexpress.com",
    averageRating: 4.8,
    totalReviews: 89,
    priceRange: "Expensive",
    hours: {
      "Monday": "11:30 AM - 10:30 PM",
      "Tuesday": "11:30 AM - 10:30 PM",
      "Wednesday": "11:30 AM - 10:30 PM",
      "Thursday": "11:30 AM - 10:30 PM",
      "Friday": "11:30 AM - 11:30 PM",
      "Saturday": "12:00 PM - 11:30 PM",
      "Sunday": "12:00 PM - 10:00 PM"
    },
    features: ["Delivery", "Takeout", "Dine-in", "Reservations"],
    images: ["https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Burger Barn",
    address: "789 Pine Street, Westside",
    cuisine: "American",
    phone: "(555) 345-6789",
    website: "https://burgerbarn.com",
    averageRating: 4.2,
    totalReviews: 203,
    priceRange: "Budget",
    hours: {
      "Monday": "10:00 AM - 11:00 PM",
      "Tuesday": "10:00 AM - 11:00 PM",
      "Wednesday": "10:00 AM - 11:00 PM",
      "Thursday": "10:00 AM - 11:00 PM",
      "Friday": "10:00 AM - 12:00 AM",
      "Saturday": "10:00 AM - 12:00 AM",
      "Sunday": "10:00 AM - 10:00 PM"
    },
    features: ["Delivery", "Takeout", "Dine-in", "Drive-thru"],
    images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Taco Fiesta",
    address: "321 Elm Street, Eastside",
    cuisine: "Mexican",
    phone: "(555) 456-7890",
    website: "https://tacofiesta.com",
    averageRating: 4.6,
    totalReviews: 156,
    priceRange: "Budget",
    hours: {
      "Monday": "11:00 AM - 10:00 PM",
      "Tuesday": "11:00 AM - 10:00 PM",
      "Wednesday": "11:00 AM - 10:00 PM",
      "Thursday": "11:00 AM - 10:00 PM",
      "Friday": "11:00 AM - 11:00 PM",
      "Saturday": "11:00 AM - 11:00 PM",
      "Sunday": "12:00 PM - 9:00 PM"
    },
    features: ["Delivery", "Takeout", "Dine-in", "Outdoor Seating"],
    images: ["https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Golden Dragon",
    address: "654 Maple Drive, Chinatown",
    cuisine: "Chinese",
    phone: "(555) 567-8901",
    website: "https://goldendragon.com",
    averageRating: 4.4,
    totalReviews: 178,
    priceRange: "Moderate",
    hours: {
      "Monday": "11:00 AM - 10:30 PM",
      "Tuesday": "11:00 AM - 10:30 PM",
      "Wednesday": "11:00 AM - 10:30 PM",
      "Thursday": "11:00 AM - 10:30 PM",
      "Friday": "11:00 AM - 11:30 PM",
      "Saturday": "11:00 AM - 11:30 PM",
      "Sunday": "12:00 PM - 10:00 PM"
    },
    features: ["Delivery", "Takeout", "Dine-in", "Reservations"],
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Le Bistro",
    address: "987 Cedar Lane, Uptown",
    cuisine: "French",
    phone: "(555) 678-9012",
    website: "https://lebistro.com",
    averageRating: 4.9,
    totalReviews: 67,
    priceRange: "Luxury",
    hours: {
      "Monday": "Closed",
      "Tuesday": "5:00 PM - 10:00 PM",
      "Wednesday": "5:00 PM - 10:00 PM",
      "Thursday": "5:00 PM - 10:00 PM",
      "Friday": "5:00 PM - 11:00 PM",
      "Saturday": "5:00 PM - 11:00 PM",
      "Sunday": "5:00 PM - 9:00 PM"
    },
    features: ["Dine-in", "Reservations", "Wine Pairing", "Private Dining"],
    images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Spice Garden",
    address: "147 Birch Road, Southside",
    cuisine: "Indian",
    phone: "(555) 789-0123",
    website: "https://spicegarden.com",
    averageRating: 4.7,
    totalReviews: 134,
    priceRange: "Moderate",
    hours: {
      "Monday": "11:30 AM - 10:00 PM",
      "Tuesday": "11:30 AM - 10:00 PM",
      "Wednesday": "11:30 AM - 10:00 PM",
      "Thursday": "11:30 AM - 10:00 PM",
      "Friday": "11:30 AM - 11:00 PM",
      "Saturday": "12:00 PM - 11:00 PM",
      "Sunday": "12:00 PM - 9:30 PM"
    },
    features: ["Delivery", "Takeout", "Dine-in", "Buffet"],
    images: ["https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Pasta House",
    address: "258 Willow Way, Northside",
    cuisine: "Italian",
    phone: "(555) 890-1234",
    website: "https://pastahouse.com",
    averageRating: 4.3,
    totalReviews: 112,
    priceRange: "Moderate",
    hours: {
      "Monday": "11:00 AM - 10:00 PM",
      "Tuesday": "11:00 AM - 10:00 PM",
      "Wednesday": "11:00 AM - 10:00 PM",
      "Thursday": "11:00 AM - 10:00 PM",
      "Friday": "11:00 AM - 11:00 PM",
      "Saturday": "12:00 PM - 11:00 PM",
      "Sunday": "12:00 PM - 9:00 PM"
    },
    features: ["Delivery", "Takeout", "Dine-in", "Wine Selection"],
    images: ["https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Steak House",
    address: "369 Spruce Street, Downtown",
    cuisine: "American",
    phone: "(555) 901-2345",
    website: "https://steakhouse.com",
    averageRating: 4.6,
    totalReviews: 89,
    priceRange: "Expensive",
    hours: {
      "Monday": "5:00 PM - 10:00 PM",
      "Tuesday": "5:00 PM - 10:00 PM",
      "Wednesday": "5:00 PM - 10:00 PM",
      "Thursday": "5:00 PM - 10:00 PM",
      "Friday": "5:00 PM - 11:00 PM",
      "Saturday": "5:00 PM - 11:00 PM",
      "Sunday": "5:00 PM - 9:00 PM"
    },
    features: ["Dine-in", "Reservations", "Private Dining", "Wine Cellar"],
    images: ["https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Pho Palace",
    address: "741 Ash Avenue, Eastside",
    cuisine: "Vietnamese",
    phone: "(555) 012-3456",
    website: "https://phopalace.com",
    averageRating: 4.5,
    totalReviews: 145,
    priceRange: "Budget",
    hours: {
      "Monday": "10:00 AM - 9:00 PM",
      "Tuesday": "10:00 AM - 9:00 PM",
      "Wednesday": "10:00 AM - 9:00 PM",
      "Thursday": "10:00 AM - 9:00 PM",
      "Friday": "10:00 AM - 10:00 PM",
      "Saturday": "10:00 AM - 10:00 PM",
      "Sunday": "10:00 AM - 8:00 PM"
    },
    features: ["Delivery", "Takeout", "Dine-in", "Quick Service"],
    images: ["https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample reviews data
const reviews = [
  {
    restaurantId: "", // Will be set after restaurant is created
    userId: "sample-user-1",
    userName: "John Doe",
    rating: 5,
    comment: "Amazing food and great service! The pizza was perfectly cooked and the atmosphere was wonderful.",
    date: new Date(),
    helpful: 12,
    images: []
  },
  {
    restaurantId: "",
    userId: "sample-user-2", 
    userName: "Jane Smith",
    rating: 4,
    comment: "Good food, reasonable prices. The staff was friendly and the restaurant was clean.",
    date: new Date(),
    helpful: 8,
    images: []
  },
  {
    restaurantId: "",
    userId: "sample-user-3",
    userName: "Mike Johnson",
    rating: 5,
    comment: "Best restaurant in town! Highly recommend trying their signature dishes.",
    date: new Date(),
    helpful: 15,
    images: []
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting to seed restaurant data...');
    
    const restaurantRef = collection(db, 'restaurants');
    const addedRestaurants = [];
    
    // Add restaurants
    for (const restaurant of restaurants) {
      const docRef = await addDoc(restaurantRef, restaurant);
      addedRestaurants.push({ id: docRef.id, ...restaurant });
      console.log(`✅ Added restaurant: ${restaurant.name} (ID: ${docRef.id})`);
    }
    
    console.log('\n📝 Adding sample reviews...');
    
    // Add reviews for each restaurant
    for (const restaurant of addedRestaurants) {
      for (const review of reviews) {
        const reviewData = {
          ...review,
          restaurantId: restaurant.id
        };
        
        await addDoc(collection(db, 'reviews'), reviewData);
        console.log(`✅ Added review for ${restaurant.name}`);
      }
    }
    
    console.log('\n🎉 Data seeding completed successfully!');
    console.log(`📊 Added ${restaurants.length} restaurants and ${restaurants.length * reviews.length} reviews`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Run the seeding function
seedData(); 