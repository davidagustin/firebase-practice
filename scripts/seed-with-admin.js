const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Note: You'll need to download your service account key from Firebase Console
// Go to Project Settings > Service Accounts > Generate New Private Key
// Save it as 'serviceAccountKey.json' in the scripts folder

let serviceAccount;
try {
  serviceAccount = require('./serviceAccountKey.json');
} catch (error) {
  console.error('❌ Service account key not found!');
  console.log('📋 To fix this:');
  console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('2. Click "Generate New Private Key"');
  console.log('3. Save the JSON file as "serviceAccountKey.json" in the scripts folder');
  console.log('4. Run this script again');
  process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

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
  
  // Generate random image
  const imageId = Math.floor(Math.random() * 1000) + 1;
  const images = [`https://images.unsplash.com/photo-${imageId}?w=500`];
  
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
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
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

// Generate 100 restaurants
const additionalRestaurants = [];
for (let i = 0; i < 100; i++) {
  additionalRestaurants.push(generateRestaurant());
}

async function seedWithAdmin() {
  try {
    console.log('🌱 Starting to add 100 restaurants using Admin SDK...');
    
    const restaurantRef = db.collection('restaurants');
    let successCount = 0;
    let errorCount = 0;
    
    for (const restaurant of additionalRestaurants) {
      try {
        await restaurantRef.add(restaurant);
        successCount++;
        console.log(`✅ Added restaurant: ${restaurant.name} (${restaurant.cuisine})`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error adding ${restaurant.name}:`, error.message);
      }
      
      // Add a small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n🎉 Restaurant seeding completed!');
    console.log(`📊 Successfully added: ${successCount} restaurants`);
    console.log(`❌ Errors: ${errorCount} restaurants`);
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
  } finally {
    // Clean up
    admin.app().delete();
  }
}

// Run the function
seedWithAdmin(); 