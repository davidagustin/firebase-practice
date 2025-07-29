const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Firebase configuration
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

// Cuisine-specific image mappings with real Unsplash photo IDs
const cuisineImages = {
  "Italian": [
    "1513104890138-7c749659a591", // Pizza
    "1621996346565-e3dbc353d2e5", // Pasta
    "1565299624946-0c6b0b0b0b0b", // Italian restaurant
    "1556909114-f6e7ad7d3136", // Italian food
    "1565299585323-38d6b0865b47" // Italian cuisine
  ],
  "Japanese": [
    "1579584425555-c3ce17fd4351", // Sushi
    "1556909114-f6e7ad7d3136", // Japanese restaurant
    "1565299624946-0c6b0b0b0b0b", // Ramen
    "1556909114-f6e7ad7d3136", // Japanese food
    "1565299585323-38d6b0865b47" // Japanese cuisine
  ],
  "Chinese": [
    "1556909114-f6e7ad7d3136", // Chinese restaurant
    "1565299624946-0c6b0b0b0b0b", // Chinese food
    "1556909114-f6e7ad7d3136", // Dim sum
    "1565299585323-38d6b0865b47", // Chinese cuisine
    "1556909114-f6e7ad7d3136" // Chinese dishes
  ],
  "Mexican": [
    "1565299585323-38d6b0865b47", // Mexican restaurant
    "1556909114-f6e7ad7d3136", // Tacos
    "1565299624946-0c6b0b0b0b0b", // Mexican food
    "1556909114-f6e7ad7d3136", // Mexican cuisine
    "1565299585323-38d6b0865b47" // Mexican dishes
  ],
  "Indian": [
    "1565557623262-b51c2513a641", // Indian restaurant
    "1556909114-f6e7ad7d3136", // Indian food
    "1565299624946-0c6b0b0b0b0b", // Curry
    "1556909114-f6e7ad7d3136", // Indian cuisine
    "1565299585323-38d6b0865b47" // Indian dishes
  ],
  "Thai": [
    "1556909114-f6e7ad7d3136", // Thai restaurant
    "1565299624946-0c6b0b0b0b0b", // Thai food
    "1556909114-f6e7ad7d3136", // Pad thai
    "1565299585323-38d6b0865b47", // Thai cuisine
    "1556909114-f6e7ad7d3136" // Thai dishes
  ],
  "Vietnamese": [
    "1559339352-11d035aa65de", // Pho
    "1556909114-f6e7ad7d3136", // Vietnamese restaurant
    "1565299624946-0c6b0b0b0b0b", // Vietnamese food
    "1556909114-f6e7ad7d3136", // Vietnamese cuisine
    "1565299585323-38d6b0865b47" // Vietnamese dishes
  ],
  "Korean": [
    "1556909114-f6e7ad7d3136", // Korean restaurant
    "1565299624946-0c6b0b0b0b0b", // Korean BBQ
    "1556909114-f6e7ad7d3136", // Korean food
    "1565299585323-38d6b0865b47", // Korean cuisine
    "1556909114-f6e7ad7d3136" // Korean dishes
  ],
  "French": [
    "1414235077428-338989a2e8c0", // French restaurant
    "1556909114-f6e7ad7d3136", // French food
    "1565299624946-0c6b0b0b0b0b", // French cuisine
    "1556909114-f6e7ad7d3136", // French dishes
    "1565299585323-38d6b0865b47" // French bistro
  ],
  "American": [
    "1568901346375-23c9450c58cd", // Burger
    "1546833999-b9f581a1996d", // Steak
    "1556909114-f6e7ad7d3136", // American restaurant
    "1565299624946-0c6b0b0b0b0b", // American food
    "1556909114-f6e7ad7d3136" // American cuisine
  ]
};

// Real Unsplash photo IDs for restaurant interiors and food
const restaurantImages = [
  "1414235077428-338989a2e8c0", // Restaurant interior
  "1556909114-f6e7ad7d3136", // Food plating
  "1565299624946-0c6b0b0b0b0b", // Restaurant ambiance
  "1565299585323-38d6b0865b47", // Dining area
  "1556909114-f6e7ad7d3136", // Kitchen
  "1565299624946-0c6b0b0b0b0b", // Bar area
  "1556909114-f6e7ad7d3136", // Outdoor seating
  "1565299585323-38d6b0865b47", // Wine cellar
  "1556909114-f6e7ad7d3136", // Chef cooking
  "1565299624946-0c6b0b0b0b0b" // Food preparation
];

// Data arrays for generating diverse restaurants
const restaurantNames = [
  "The Golden Fork", "Spice Route", "Ocean's Bounty", "Mountain View", "Urban Kitchen",
  "Riverside Cafe", "Sunset Grill", "Moonlight Bistro", "Starlight Diner", "Coastal Kitchen",
  "Harbor House", "Garden Terrace", "Skyline Restaurant", "Valley View", "Peak Dining",
  "Lakeside Lodge", "Forest Feast", "Desert Rose", "Alpine Lodge", "Seaside Shack",
  "Downtown Delight", "Uptown Eats", "Midtown Munchies", "Westside Wok", "Eastside Eats",
  "Northside Nosh", "Southside Sizzle", "Central Station", "The Corner Cafe", "Main Street Grill",
  "Oak Avenue Kitchen", "Pine Street Pub", "Elm Street Eatery", "Maple Drive Diner", "Cedar Lane Cafe",
  "Birch Road Bistro", "Willow Way Wok", "Spruce Street Sushi", "Ash Avenue Asian", "Poplar Place Pizza",
  "Sycamore Street Steakhouse", "Magnolia Mansion", "Juniper Junction", "Cypress Corner", "Redwood Retreat",
  "Sequoia Station", "Palm Tree Palace", "Bamboo Garden", "Cherry Blossom", "Lotus Leaf",
  "Golden Lotus", "Silver Dragon", "Jade Palace", "Ruby Red", "Emerald Isle",
  "Sapphire Blue", "Diamond Cut", "Platinum Plate", "Copper Kettle", "Iron Chef",
  "Steel Pan", "Brass Ring", "Bronze Age", "Silver Spoon", "Golden Plate",
  "Crystal Clear", "Pearl Harbor", "Coral Reef", "Amber Alert", "Onyx Black",
  "Ivory Tower", "Ebony Wood", "Mahogany Manor", "Teak Table", "Walnut Wall",
  "Chestnut Corner", "Hazelnut House", "Almond Avenue", "Pecan Place", "Cashew Corner",
  "Pistachio Palace", "Macadamia Manor", "Brazilian Bite", "Filbert's Feast", "Pine Nut Place",
  "Sunflower Seed", "Pumpkin Patch", "Squash Court", "Zucchini Zone", "Cucumber Corner",
  "Tomato Town", "Pepper Palace", "Onion Oasis", "Garlic Garden", "Ginger Grove",
  "Turmeric Town", "Cinnamon Street", "Nutmeg Nook", "Clove Corner", "Cardamom Cafe",
  "Saffron Street", "Vanilla Valley", "Chocolate Chip", "Caramel Corner", "Honey House"
];

const cuisines = [
  "Italian", "Japanese", "Chinese", "Mexican", "Indian", "Thai", "Vietnamese", "Korean",
  "French", "Spanish", "Greek", "Mediterranean", "American", "British", "German", "Russian",
  "Turkish", "Lebanese", "Moroccan", "Ethiopian", "Egyptian", "South African", "Brazilian",
  "Argentine", "Peruvian", "Colombian", "Venezuelan", "Caribbean", "Cuban", "Puerto Rican",
  "Jamaican", "Haitian", "Dominican", "Trinidadian", "Barbadian", "Grenadian", "St. Lucian",
  "Australian", "New Zealand", "Fijian", "Tongan", "Samoan", "Hawaiian", "Filipino",
  "Indonesian", "Malaysian", "Singaporean", "Cambodian", "Laotian", "Myanmar", "Nepalese",
  "Sri Lankan", "Bangladeshi", "Pakistani", "Afghan", "Iranian", "Iraqi", "Syrian",
  "Jordanian", "Israeli", "Palestinian", "Yemeni", "Omani", "Emirati", "Qatari",
  "Kuwaiti", "Bahraini", "Saudi", "Iraqi", "Kurdish", "Armenian", "Georgian",
  "Azerbaijani", "Kazakh", "Uzbek", "Turkmen", "Kyrgyz", "Tajik", "Mongolian",
  "Tibetan", "Bhutanese", "Maldives", "Seychelles", "Mauritian", "Madagascan",
  "Comorian", "Mayotte", "Reunion", "French Polynesian", "New Caledonian", "Vanuatuan"
];

const streets = [
  "Main Street", "Oak Avenue", "Pine Street", "Elm Street", "Maple Drive", "Cedar Lane",
  "Birch Road", "Willow Way", "Spruce Street", "Ash Avenue", "Poplar Place", "Sycamore Street",
  "Magnolia Drive", "Juniper Lane", "Cypress Road", "Redwood Way", "Sequoia Street", "Palm Tree Lane",
  "Bamboo Road", "Cherry Blossom Way", "Lotus Street", "Golden Lane", "Silver Road", "Jade Street",
  "Ruby Lane", "Emerald Road", "Sapphire Street", "Diamond Way", "Platinum Road", "Copper Street",
  "Iron Lane", "Steel Road", "Brass Street", "Bronze Lane", "Crystal Road", "Pearl Street",
  "Coral Lane", "Amber Road", "Onyx Street", "Ivory Lane", "Ebony Road", "Mahogany Street",
  "Teak Lane", "Walnut Road", "Chestnut Street", "Hazelnut Lane", "Almond Road", "Pecan Street",
  "Cashew Lane", "Pistachio Road", "Macadamia Street", "Brazilian Lane", "Filbert Road", "Pine Nut Street"
];

const neighborhoods = [
  "Downtown", "Uptown", "Midtown", "Westside", "Eastside", "Northside", "Southside",
  "Chinatown", "Little Italy", "Koreatown", "Japantown", "Little Mexico", "Little India",
  "Greek Town", "Little Havana", "Little Saigon", "Little Tokyo", "Little Manila",
  "Little Beirut", "Little Ethiopia", "Little Armenia", "Little Russia", "Little Ukraine",
  "Little Poland", "Little Germany", "Little France", "Little Spain", "Little Portugal",
  "Little Brazil", "Little Argentina", "Little Colombia", "Little Venezuela", "Little Peru",
  "Little Chile", "Little Uruguay", "Little Paraguay", "Little Bolivia", "Little Ecuador",
  "Little Guyana", "Little Suriname", "Little French Guiana", "Little Belize", "Little Guatemala",
  "Little Honduras", "Little Nicaragua", "Little Costa Rica", "Little Panama", "Little El Salvador"
];

const features = [
  "Delivery", "Takeout", "Dine-in", "Outdoor Seating", "Reservations", "Private Dining",
  "Wine Pairing", "Buffet", "Quick Service", "Drive-thru", "Catering", "Live Music",
  "Karaoke", "Sports Bar", "Rooftop Dining", "Waterfront", "Garden Seating", "Fireplace",
  "Wine Cellar", "Craft Beer", "Cocktail Bar", "Coffee Bar", "Dessert Menu", "Gluten-Free Options",
  "Vegetarian Options", "Vegan Options", "Halal", "Kosher", "Organic", "Farm-to-Table",
  "Local Ingredients", "Seasonal Menu", "Chef's Table", "Tasting Menu", "Happy Hour",
  "Brunch", "Breakfast", "Lunch", "Dinner", "Late Night", "24 Hours", "Pet Friendly",
  "Wheelchair Accessible", "Parking Available", "Valet Parking", "Street Parking",
  "Bike Parking", "Public Transit", "Free WiFi", "Business Lunch", "Date Night",
  "Family Friendly", "Romantic", "Casual", "Upscale", "Fine Dining", "Fast Casual"
];

const priceRanges = ["Budget", "Moderate", "Expensive", "Luxury"];

const phonePrefixes = ["(555)", "(444)", "(333)", "(222)", "(111)", "(999)", "(888)", "(777)", "(666)"];

const websites = [
  "restaurant.com", "dining.com", "eats.com", "kitchen.com", "bistro.com", "cafe.com",
  "grill.com", "diner.com", "kitchen.com", "house.com", "lodge.com", "palace.com",
  "mansion.com", "manor.com", "estate.com", "villa.com", "cottage.com", "cabin.com",
  "shack.com", "hut.com", "shed.com", "barn.com", "stable.com", "garage.com",
  "warehouse.com", "factory.com", "mill.com", "forge.com", "foundry.com", "workshop.com"
];

// Generate cuisine-specific images
function generateImages(cuisine) {
  const images = [];
  
  // Add cuisine-specific images if available
  if (cuisineImages[cuisine]) {
    const cuisineSpecificImages = cuisineImages[cuisine];
    const numCuisineImages = Math.min(3, cuisineSpecificImages.length);
    const shuffledCuisineImages = [...cuisineSpecificImages].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < numCuisineImages; i++) {
      images.push(`https://images.unsplash.com/photo-${shuffledCuisineImages[i]}?w=500&h=300&fit=crop`);
    }
  }
  
  // Add general restaurant images
  const numGeneralImages = Math.min(2, restaurantImages.length);
  const shuffledGeneralImages = [...restaurantImages].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < numGeneralImages; i++) {
    images.push(`https://images.unsplash.com/photo-${shuffledGeneralImages[i]}?w=500&h=300&fit=crop`);
  }
  
  // Ensure we have at least 3 images
  while (images.length < 3) {
    const randomImageId = Math.floor(Math.random() * 1000) + 1;
    images.push(`https://images.unsplash.com/photo-${randomImageId}?w=500&h=300&fit=crop`);
  }
  
  return images.slice(0, 5); // Return max 5 images
}

// Generate random restaurant data
function generateRestaurant() {
  const name = restaurantNames[Math.floor(Math.random() * restaurantNames.length)];
  const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
  const priceRange = priceRanges[Math.floor(Math.random() * priceRanges.length)];
  const phonePrefix = phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)];
  const website = websites[Math.floor(Math.random() * websites.length)];
  
  // Generate random phone number
  const phone = `${phonePrefix} ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
  
  // Generate random rating and reviews
  const averageRating = Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 to 5.0
  const totalReviews = Math.floor(Math.random() * 500) + 10; // 10 to 509
  
  // Generate random features (3-6 features)
  const numFeatures = Math.floor(Math.random() * 4) + 3;
  const selectedFeatures = [];
  const shuffledFeatures = [...features].sort(() => 0.5 - Math.random());
  for (let i = 0; i < numFeatures; i++) {
    selectedFeatures.push(shuffledFeatures[i]);
  }
  
  // Generate hours
  const hours = {
    "Monday": generateHours(),
    "Tuesday": generateHours(),
    "Wednesday": generateHours(),
    "Thursday": generateHours(),
    "Friday": generateHours(),
    "Saturday": generateHours(),
    "Sunday": generateHours()
  };
  
  // Generate cuisine-specific images
  const images = generateImages(cuisine);
  
  return {
    name,
    address: `${Math.floor(Math.random() * 9999) + 1} ${street}, ${neighborhood}`,
    cuisine,
    phone,
    website: `https://${name.toLowerCase().replace(/\s+/g, '')}.${website}`,
    averageRating,
    totalReviews,
    priceRange,
    hours,
    features: selectedFeatures,
    images,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Generate random hours
function generateHours() {
  const openHour = Math.floor(Math.random() * 4) + 7; // 7 AM to 10 AM
  const closeHour = Math.floor(Math.random() * 4) + 20; // 8 PM to 11 PM
  const openMinute = Math.random() > 0.5 ? "00" : "30";
  const closeMinute = Math.random() > 0.5 ? "00" : "30";
  
  if (Math.random() > 0.9) { // 10% chance of being closed
    return "Closed";
  }
  
  return `${openHour}:${openMinute} AM - ${closeHour}:${closeMinute} PM`;
}

// Generate 50 restaurants with proper images
const additionalRestaurants = [];
for (let i = 0; i < 50; i++) {
  additionalRestaurants.push(generateRestaurant());
}

async function seedWithImages() {
  try {
    console.log('🌱 Starting to add 50 restaurants with proper images...');
    
    const restaurantRef = collection(db, 'restaurants');
    let successCount = 0;
    let errorCount = 0;
    
    for (const restaurant of additionalRestaurants) {
      try {
        await addDoc(restaurantRef, restaurant);
        successCount++;
        console.log(`✅ Added restaurant: ${restaurant.name} (${restaurant.cuisine}) with ${restaurant.images.length} images`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error adding ${restaurant.name}:`, error.message);
      }
      
      // Add a small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n🎉 Restaurant seeding completed!');
    console.log(`📊 Successfully added: ${successCount} restaurants with images`);
    console.log(`❌ Errors: ${errorCount} restaurants`);
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
  }
}

// Run the function
seedWithImages(); 