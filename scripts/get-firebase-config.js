const fs = require('fs');
const path = require('path');

// Function to read and parse the environment file
function getFirebaseConfig() {
  try {
    // Try to read the environment file
    const envPath = path.join(__dirname, '..', 'src', 'environments', 'environment.ts');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Extract the firebase config object
    const firebaseMatch = envContent.match(/firebase:\s*{[\s\S]*?}/);
    
    if (firebaseMatch) {
      console.log('✅ Found Firebase configuration in environment.ts:');
      console.log('\n' + firebaseMatch[0]);
      console.log('\n📝 Copy this configuration to scripts/seed-data.js');
    } else {
      console.log('❌ Could not find Firebase configuration in environment.ts');
      console.log('Please make sure your environment.ts file contains the firebase config object.');
    }
    
  } catch (error) {
    console.log('❌ Error reading environment file:', error.message);
    console.log('\n📋 Manual steps to get Firebase config:');
    console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
    console.log('2. Select your project');
    console.log('3. Go to Project Settings (gear icon)');
    console.log('4. Scroll down to "Your apps" section');
    console.log('5. Click on your web app or create a new one');
    console.log('6. Copy the firebaseConfig object');
    console.log('7. Update scripts/seed-data.js with your config');
  }
}

// Run the function
getFirebaseConfig(); 