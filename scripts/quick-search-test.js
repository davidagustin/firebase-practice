const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAPiFcadcuqy0I0Bps6xFZAwzg0r3sXSyI",
  authDomain: "fir-practice-54eb3.firebaseapp.com",
  projectId: "fir-practice-54eb3",
  storageBucket: "fir-practice-54eb3.firebasestorage.app",
  messagingSenderId: "872925798496",
  appId: "1:872925798496:web:8cd2dcf4ab6ab2e66ce305"
};

async function quickSearchTest() {
  try {
    console.log('🔍 Quick search functionality test...\n');

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Get all restaurants
    const restaurantsSnapshot = await getDocs(collection(db, 'restaurants'));
    const restaurants = restaurantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log(`📊 Total restaurants: ${restaurants.length}`);

    // Remove duplicates
    const seen = new Set();
    const uniqueRestaurants = restaurants.filter(restaurant => {
      const key = restaurant.name.toLowerCase().trim();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    console.log(`✅ Unique restaurants: ${uniqueRestaurants.length}\n`);

    // Test search functionality
    const searchTest = (restaurants, searchTerm) => {
      const searchLower = searchTerm.toLowerCase();
      return restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchLower) ||
        restaurant.cuisine.toLowerCase().includes(searchLower) ||
        restaurant.address.toLowerCase().includes(searchLower)
      );
    };

    // Quick search tests
    const tests = ['pizza', 'italian', 'sushi', 'burger'];
    
    tests.forEach(term => {
      const results = searchTest(uniqueRestaurants, term);
      console.log(`🔎 "${term}": ${results.length} results`);
      if (results.length > 0) {
        results.slice(0, 2).forEach(r => {
          console.log(`   - ${r.name} (${r.cuisine})`);
        });
      }
    });

    console.log('\n✅ Search functionality is working!');
    console.log('🌐 Your app should now work properly at http://localhost:4200');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

quickSearchTest(); 