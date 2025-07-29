const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyAPiFcadcuqy0I0Bps6xFZAwzg0r3sXSyI",
  authDomain: "fir-practice-54eb3.firebaseapp.com",
  projectId: "fir-practice-54eb3",
  storageBucket: "fir-practice-54eb3.firebasestorage.app",
  messagingSenderId: "872925798496",
  appId: "1:872925798496:web:8cd2dcf4ab6ab2e66ce305"
};

async function debugFirebase() {
  try {
    console.log('🔍 Debugging Firebase Configuration...');
    console.log('📋 Config:', JSON.stringify(firebaseConfig, null, 2));
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase App initialized');
    
    // Test Firestore
    console.log('\n🔥 Testing Firestore...');
    try {
      const db = getFirestore(app);
      const snapshot = await getDocs(collection(db, 'restaurants'));
      console.log('✅ Firestore working - Found', snapshot.size, 'restaurants');
    } catch (firestoreError) {
      console.log('❌ Firestore error:', firestoreError.message);
    }
    
    // Test Auth
    console.log('\n🔐 Testing Authentication...');
    try {
      const auth = getAuth(app);
      console.log('✅ Auth initialized');
      console.log('👤 Current user:', auth.currentUser ? auth.currentUser.email : 'None');
    } catch (authError) {
      console.log('❌ Auth error:', authError.message);
    }
    
    console.log('\n📊 Summary:');
    console.log('- Project ID:', firebaseConfig.projectId);
    console.log('- Auth Domain:', firebaseConfig.authDomain);
    console.log('- API Key:', firebaseConfig.apiKey.substring(0, 10) + '...');
    
  } catch (error) {
    console.error('❌ Firebase debug failed:', error.message);
  }
}

debugFirebase(); 