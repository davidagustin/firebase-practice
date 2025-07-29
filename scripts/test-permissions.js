const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAPiFcadcuqy0I0Bps6xFZAwzg0r3sXSyI",
  authDomain: "fir-practice-54eb3.firebaseapp.com",
  projectId: "fir-practice-54eb3",
  storageBucket: "fir-practice-54eb3.firebasestorage.app",
  messagingSenderId: "872925798496",
  appId: "1:872925798496:web:8cd2dcf4ab6ab2e66ce305"
};

async function testPermissions() {
  try {
    console.log('🔍 Testing Firestore permissions...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Test write permission
    console.log('📝 Testing write permission...');
    const testDoc = await addDoc(collection(db, 'permission-test'), {
      message: 'Test document',
      timestamp: new Date()
    });
    console.log('✅ Write permission working! Document ID:', testDoc.id);
    
    // Test read permission
    console.log('📖 Testing read permission...');
    const snapshot = await getDocs(collection(db, 'restaurants'));
    console.log('✅ Read permission working! Found', snapshot.size, 'restaurants');
    
    console.log('\n🎉 All permissions are working correctly!');
    console.log('You can now run the seed script to add restaurant data.');
    
  } catch (error) {
    console.error('❌ Permission test failed:', error.message);
    console.log('\n📋 Please check:');
    console.log('1. Firestore security rules are set to allow read/write');
    console.log('2. Rules have been published and propagated');
    console.log('3. Firestore database is created and enabled');
  }
}

testPermissions(); 