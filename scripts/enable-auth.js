const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyAPiFcadcuqy0I0Bps6xFZAwzg0r3sXSyI",
  authDomain: "fir-practice-54eb3.firebaseapp.com",
  projectId: "fir-practice-54eb3",
  storageBucket: "fir-practice-54eb3.firebasestorage.app",
  messagingSenderId: "872925798496",
  appId: "1:872925798496:web:8cd2dcf4ab6ab2e66ce305"
};

async function testAuthentication() {
  try {
    console.log('🔐 Testing Firebase Authentication...');
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    console.log('✅ Firebase Auth initialized successfully');
    console.log('📝 Testing authentication functionality...');
    
    // Test user creation
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    console.log('👤 Creating test user...');
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Test user created successfully!');
    console.log('📧 Email:', testEmail);
    console.log('🆔 User ID:', userCredential.user.uid);
    
    // Sign out
    await auth.signOut();
    console.log('🚪 Signed out successfully');
    
    // Test sign in
    console.log('🔑 Testing sign in...');
    const signInCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Sign in successful!');
    console.log('👤 Current user:', signInCredential.user.email);
    
    console.log('\n🎉 Authentication is working perfectly!');
    console.log('You can now use the login/signup features in your app.');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    
    if (error.code === 'auth/operation-not-allowed') {
      console.log('\n📋 To fix this:');
      console.log('1. Go to Firebase Console → Authentication');
      console.log('2. Click "Get started"');
      console.log('3. Go to "Sign-in method" tab');
      console.log('4. Enable "Email/Password" provider');
      console.log('5. Click "Save"');
      console.log('6. Run this script again');
    } else {
      console.log('\n📋 Please check:');
      console.log('1. Firebase Authentication is enabled');
      console.log('2. Email/Password sign-in method is enabled');
      console.log('3. Your Firebase configuration is correct');
    }
  }
}

testAuthentication(); 