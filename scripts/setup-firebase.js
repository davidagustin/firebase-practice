#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔥 Firebase Setup Helper');
console.log('========================\n');

console.log('This script will help you configure Firebase for your restaurant rating app.\n');

console.log('📋 Prerequisites:');
console.log('1. You need a Firebase project created at https://console.firebase.google.com/');
console.log('2. Firestore Database should be enabled in your project');
console.log('3. You should have your Firebase configuration ready\n');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupFirebase() {
  try {
    const hasProject = await question('Do you have a Firebase project created? (y/n): ');
    
    if (hasProject.toLowerCase() !== 'y') {
      console.log('\n📝 Please create a Firebase project first:');
      console.log('1. Go to https://console.firebase.google.com/');
      console.log('2. Click "Create a project"');
      console.log('3. Follow the setup wizard');
      console.log('4. Enable Firestore Database');
      console.log('5. Come back and run this script again\n');
      rl.close();
      return;
    }

    console.log('\n📝 Now we need your Firebase configuration.');
    console.log('To get it:');
    console.log('1. Go to Firebase Console → Project Settings (gear icon)');
    console.log('2. Scroll down to "Your apps" section');
    console.log('3. Click on your web app or create a new one');
    console.log('4. Copy the firebaseConfig object\n');

    const apiKey = await question('Enter your API Key: ');
    const authDomain = await question('Enter your Auth Domain: ');
    const projectId = await question('Enter your Project ID: ');
    const storageBucket = await question('Enter your Storage Bucket: ');
    const messagingSenderId = await question('Enter your Messaging Sender ID: ');
    const appId = await question('Enter your App ID: ');

    const firebaseConfig = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId
    };

    console.log('\n✅ Configuration collected!');
    
    const updateFiles = await question('Do you want to update the configuration files automatically? (y/n): ');
    
    if (updateFiles.toLowerCase() === 'y') {
      // Update environment.ts
      const envPath = path.join(__dirname, '..', 'src', 'environments', 'environment.ts');
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      const firebaseConfigString = `firebase: {
    apiKey: "${apiKey}",
    authDomain: "${authDomain}",
    projectId: "${projectId}",
    storageBucket: "${storageBucket}",
    messagingSenderId: "${messagingSenderId}",
    appId: "${appId}"
  }`;
      
      envContent = envContent.replace(
        /firebase:\s*{[\s\S]*?}/,
        firebaseConfigString
      );
      
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Updated src/environments/environment.ts');

      // Update environment.prod.ts
      const envProdPath = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');
      let envProdContent = fs.readFileSync(envProdPath, 'utf8');
      
      envProdContent = envProdContent.replace(
        /firebase:\s*{[\s\S]*?}/,
        firebaseConfigString
      );
      
      fs.writeFileSync(envProdPath, envProdContent);
      console.log('✅ Updated src/environments/environment.prod.ts');

      // Update seed-data.js
      const seedPath = path.join(__dirname, 'seed-data.js');
      let seedContent = fs.readFileSync(seedPath, 'utf8');
      
      const seedConfigString = `const firebaseConfig = {
  apiKey: "${apiKey}",
  authDomain: "${authDomain}",
  projectId: "${projectId}",
  storageBucket: "${storageBucket}",
  messagingSenderId: "${messagingSenderId}",
  appId: "${appId}"
};`;
      
      seedContent = seedContent.replace(
        /const firebaseConfig = {[\s\S]*?};/,
        seedConfigString
      );
      
      fs.writeFileSync(seedPath, seedContent);
      console.log('✅ Updated scripts/seed-data.js');

      console.log('\n🎉 All configuration files updated!');
      
      const runSeed = await question('\nDo you want to run the seed script to add sample restaurant data? (y/n): ');
      
      if (runSeed.toLowerCase() === 'y') {
        console.log('\n🌱 Running seed script...');
        console.log('Make sure you have set up Firestore security rules first!');
        
        const { exec } = require('child_process');
        exec('cd scripts && node seed-data.js', (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Error running seed script:', error.message);
            console.log('Please run it manually: cd scripts && node seed-data.js');
          } else {
            console.log(stdout);
          }
        });
      }
    } else {
      console.log('\n📝 Manual update required. Please update these files:');
      console.log('1. src/environments/environment.ts');
      console.log('2. src/environments/environment.prod.ts');
      console.log('3. scripts/seed-data.js');
      console.log('\nUse this configuration:');
      console.log(JSON.stringify(firebaseConfig, null, 2));
    }

    console.log('\n📋 Next steps:');
    console.log('1. Set up Firestore security rules (see SETUP_FIREBASE.md)');
    console.log('2. Run the seed script: cd scripts && node seed-data.js');
    console.log('3. Start your app: npm start');
    console.log('4. Test the application at http://localhost:4200');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
  } finally {
    rl.close();
  }
}

setupFirebase(); 