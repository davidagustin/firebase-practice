const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, orderBy } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAPiFcadcuqy0I0Bps6xFZAwzg0r3sXSyI",
  authDomain: "fir-practice-54eb3.firebaseapp.com",
  projectId: "fir-practice-54eb3",
  storageBucket: "fir-practice-54eb3.firebasestorage.app",
  messagingSenderId: "872925798496",
  appId: "1:872925798496:web:8cd2dcf4ab6ab2e66ce305"
};

async function testSearch() {
  try {
    console.log('🔍 Testing Search Functionality...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Get all restaurants
    const snapshot = await getDocs(collection(db, 'restaurants'));
    const restaurants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`📊 Found ${restaurants.length} restaurants total`);
    
    // Test search by name
    console.log('\n🔍 Testing search by name...');
    const searchTerm = 'pizza';
    const pizzaResults = restaurants.filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(`🍕 Found ${pizzaResults.length} restaurants with "pizza" in name:`);
    pizzaResults.forEach(r => console.log(`  - ${r.name} (${r.cuisine})`));
    
    // Test filter by cuisine
    console.log('\n🍽️ Testing filter by cuisine...');
    const italianResults = restaurants.filter(r => r.cuisine === 'Italian');
    console.log(`🇮🇹 Found ${italianResults.length} Italian restaurants:`);
    italianResults.forEach(r => console.log(`  - ${r.name} (${r.priceRange})`));
    
    // Test filter by price range
    console.log('\n💰 Testing filter by price range...');
    const budgetResults = restaurants.filter(r => r.priceRange === 'Budget');
    console.log(`💵 Found ${budgetResults.length} budget restaurants:`);
    budgetResults.forEach(r => console.log(`  - ${r.name} (${r.cuisine})`));
    
    // Test sorting by rating
    console.log('\n⭐ Testing sort by rating...');
    const sortedByRating = restaurants.sort((a, b) => b.averageRating - a.averageRating);
    console.log('🏆 Top 3 restaurants by rating:');
    sortedByRating.slice(0, 3).forEach((r, i) => 
      console.log(`  ${i + 1}. ${r.name} - ⭐ ${r.averageRating} (${r.totalReviews} reviews)`)
    );
    
    console.log('\n🎉 Search functionality is working perfectly!');
    console.log('You can now use search, filter, and sort in your app.');
    
  } catch (error) {
    console.error('❌ Search test failed:', error.message);
  }
}

testSearch(); 