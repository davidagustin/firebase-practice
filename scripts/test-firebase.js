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

async function testFirebase() {
  try {
    console.log('🔍 Testing Firebase connection...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase initialized successfully');
    console.log('🔍 Project ID:', firebaseConfig.projectId);
    
    // Try to read from a collection
    console.log('🔍 Testing read permissions...');
    const testCollection = collection(db, 'test');
    
    try {
      const snapshot = await getDocs(testCollection);
      console.log('✅ Read permissions working');
      console.log('📊 Found', snapshot.size, 'documents in test collection');
    } catch (readError) {
      console.log('❌ Read error:', readError.message);
    }
    
    // Try to write to a collection
    console.log('🔍 Testing write permissions...');
    const { addDoc } = require('firebase/firestore');
    
    try {
      const docRef = await addDoc(collection(db, 'test'), {
        message: 'Test document',
        timestamp: new Date()
      });
      console.log('✅ Write permissions working');
      console.log('📝 Created document with ID:', docRef.id);
    } catch (writeError) {
      console.log('❌ Write error:', writeError.message);
    }
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error.message);
    console.log('\n📋 Troubleshooting steps:');
    console.log('1. Check if Firestore Database is created in Firebase Console');
    console.log('2. Verify security rules allow read/write');
    console.log('3. Make sure Firestore API is enabled');
  }
}

testFirebase(); 