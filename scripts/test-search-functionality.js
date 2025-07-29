const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, orderBy, limit } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAPiFcadcuqy0I0Bps6xFZAwzg0r3sXSyI",
  authDomain: "fir-practice-54eb3.firebaseapp.com",
  projectId: "fir-practice-54eb3",
  storageBucket: "fir-practice-54eb3.firebasestorage.app",
  messagingSenderId: "872925798496",
  appId: "1:872925798496:web:8cd2dcf4ab6ab2e66ce305"
};

async function testSearchFunctionality() {
  try {
    console.log('🔍 Testing search functionality...\n');

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Get all restaurants
    const restaurantsSnapshot = await getDocs(collection(db, 'restaurants'));
    const restaurants = restaurantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log(`📊 Total restaurants in database: ${restaurants.length}\n`);

    // Test search by name
    console.log('🔎 Testing search by name:');
    const searchByName = (restaurants, searchTerm) => {
      const searchLower = searchTerm.toLowerCase();
      return restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchLower) ||
        restaurant.cuisine.toLowerCase().includes(searchLower) ||
        restaurant.address.toLowerCase().includes(searchLower) ||
        restaurant.features.some(feature => 
          feature.toLowerCase().includes(searchLower)
        )
      );
    };

    // Test various search terms
    const searchTests = [
      'pizza',
      'italian',
      'sushi',
      'burger',
      'thai',
      'mexican',
      'downtown',
      'organic',
      'vegan'
    ];

    searchTests.forEach(searchTerm => {
      const results = searchByName(restaurants, searchTerm);
      console.log(`  "${searchTerm}": ${results.length} results`);
      if (results.length > 0) {
        results.slice(0, 3).forEach(restaurant => {
          console.log(`    - ${restaurant.name} (${restaurant.cuisine})`);
        });
        if (results.length > 3) {
          console.log(`    ... and ${results.length - 3} more`);
        }
      }
    });

    console.log('\n🏷️ Testing filter by cuisine:');
    const cuisines = [...new Set(restaurants.map(r => r.cuisine))];
    cuisines.forEach(cuisine => {
      const results = restaurants.filter(r => r.cuisine === cuisine);
      console.log(`  ${cuisine}: ${results.length} restaurants`);
    });

    console.log('\n💰 Testing filter by price range:');
    const priceRanges = [...new Set(restaurants.map(r => r.priceRange))];
    priceRanges.forEach(priceRange => {
      const results = restaurants.filter(r => r.priceRange === priceRange);
      console.log(`  ${priceRange}: ${results.length} restaurants`);
    });

    console.log('\n⭐ Testing sorting:');
    console.log('  Top 5 by rating:');
    const topByRating = [...restaurants]
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);
    topByRating.forEach((restaurant, index) => {
      console.log(`    ${index + 1}. ${restaurant.name} - ⭐ ${restaurant.averageRating} (${restaurant.totalReviews} reviews)`);
    });

    console.log('\n  Top 5 by review count:');
    const topByReviews = [...restaurants]
      .sort((a, b) => b.totalReviews - a.totalReviews)
      .slice(0, 5);
    topByReviews.forEach((restaurant, index) => {
      console.log(`    ${index + 1}. ${restaurant.name} - ${restaurant.totalReviews} reviews`);
    });

    console.log('\n✅ Search functionality test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`  - Total restaurants: ${restaurants.length}`);
    console.log(`  - Unique cuisines: ${cuisines.length}`);
    console.log(`  - Price ranges: ${priceRanges.length}`);
    console.log(`  - Search terms tested: ${searchTests.length}`);

  } catch (error) {
    console.error('❌ Search functionality test failed:', error.message);
  }
}

testSearchFunctionality(); 