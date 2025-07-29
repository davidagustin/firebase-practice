const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAPiFcadcuqy0I0Bps6xFZAwzg0r3sXSyI",
  authDomain: "fir-practice-54eb3.firebaseapp.com",
  projectId: "fir-practice-54eb3",
  storageBucket: "fir-practice-54eb3.firebasestorage.app",
  messagingSenderId: "872925798496",
  appId: "1:872925798496:web:8cd2dcf4ab6ab2e66ce305"
};

async function cleanDuplicates() {
  try {
    console.log('🧹 Cleaning duplicate restaurants...\n');

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Get all restaurants
    const restaurantsSnapshot = await getDocs(collection(db, 'restaurants'));
    const restaurants = restaurantsSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));

    console.log(`📊 Total restaurants found: ${restaurants.length}`);

    // Find duplicates by name
    const nameMap = new Map();
    const duplicates = [];

    restaurants.forEach(restaurant => {
      const key = restaurant.name.toLowerCase().trim();
      if (nameMap.has(key)) {
        duplicates.push({
          original: nameMap.get(key),
          duplicate: restaurant
        });
      } else {
        nameMap.set(key, restaurant);
      }
    });

    console.log(`🔍 Found ${duplicates.length} duplicate entries`);

    if (duplicates.length === 0) {
      console.log('✅ No duplicates found!');
      return;
    }

    // Show duplicates
    console.log('\n📋 Duplicate entries:');
    duplicates.forEach((dup, index) => {
      console.log(`${index + 1}. ${dup.duplicate.name} (ID: ${dup.duplicate.id})`);
      console.log(`   Original: ${dup.original.name} (ID: ${dup.original.id})`);
    });

    // Delete duplicates (keep the first one)
    console.log('\n🗑️ Deleting duplicate entries...');
    let deletedCount = 0;

    for (const dup of duplicates) {
      try {
        await deleteDoc(doc(db, 'restaurants', dup.duplicate.id));
        console.log(`✅ Deleted: ${dup.duplicate.name} (${dup.duplicate.id})`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Failed to delete ${dup.duplicate.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Cleanup complete! Deleted ${deletedCount} duplicate entries.`);

    // Verify cleanup
    const finalSnapshot = await getDocs(collection(db, 'restaurants'));
    const finalRestaurants = finalSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));

    console.log(`📊 Final restaurant count: ${finalRestaurants.length}`);

    // Show unique restaurants
    console.log('\n🍽️ Unique restaurants:');
    const uniqueNames = [...new Set(finalRestaurants.map(r => r.name))];
    uniqueNames.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}

cleanDuplicates(); 